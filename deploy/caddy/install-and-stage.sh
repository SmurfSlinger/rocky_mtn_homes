#!/usr/bin/env bash
# Install Caddy and stage Caddyfile.next without cutover (k3s keeps 443).
# Run: sudo bash /var/www/rocky-mountain-homes-next/deploy/caddy/install-and-stage.sh
set -eu

REPO="/var/www/rocky-mountain-homes-next"
STAGED="/etc/caddy/Caddyfile.next"
SOURCE="${REPO}/deploy/caddy/Caddyfile.next"
PLACEHOLDER="/etc/caddy/Caddyfile"

echo "==> Install prerequisites"
apt-get update -qq
apt-get install -y debian-keyring debian-archive-keyring apt-transport-https curl ca-certificates gnupg

echo "==> Add Caddy stable repository"
curl -fsSL 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' \
  | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -fsSL 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' \
  -o /etc/apt/sources.list.d/caddy-stable.list

echo "==> Install Caddy"
apt-get update -qq
apt-get install -y caddy

echo "==> Caddy version"
caddy version

echo "==> Placeholder Caddyfile (no public 80/443) and disable service until cutover"
mkdir -p /etc/caddy
if [ -f "${PLACEHOLDER}" ]; then
  cp -a "${PLACEHOLDER}" "${PLACEHOLDER}.bak.$(date +%Y%m%d%H%M%S)"
fi
cat > "${PLACEHOLDER}" <<'EOF'
# Placeholder — public sites are in Caddyfile.next (not active until cutover).
:2019 {
	respond "Caddy staged; cutover not active. See Caddyfile.next." 503
}
EOF

systemctl stop caddy 2>/dev/null || true
systemctl disable caddy 2>/dev/null || true

echo "==> Stage cutover config"
cp "${SOURCE}" "${STAGED}"
chmod 644 "${STAGED}"

echo "==> Stage TLS material for caddy user (root:caddy, mode 640)"
if ! id caddy >/dev/null 2>&1; then
  echo "ERROR: caddy user not found after package install"
  exit 1
fi

install -d -m 750 -o root -g caddy /etc/caddy/certs

for src in \
  /etc/letsencrypt/live/rockymountainhomesales.com/fullchain.pem \
  /etc/letsencrypt/live/rockymountainhomesales.com/privkey.pem \
  /etc/ssl/cloudflare/photographybypiv.com.pem \
  /etc/ssl/cloudflare/photographybypiv.com.key
do
  if [ ! -f "$src" ]; then
    echo "MISSING: $src"
    exit 1
  fi
done

install -m 640 -o root -g caddy \
  /etc/letsencrypt/live/rockymountainhomesales.com/fullchain.pem \
  /etc/caddy/certs/rockymountainhomesales.com-fullchain.pem
install -m 640 -o root -g caddy \
  /etc/letsencrypt/live/rockymountainhomesales.com/privkey.pem \
  /etc/caddy/certs/rockymountainhomesales.com-privkey.pem
install -m 640 -o root -g caddy \
  /etc/ssl/cloudflare/photographybypiv.com.pem \
  /etc/caddy/certs/photographybypiv.com.pem
install -m 640 -o root -g caddy \
  /etc/ssl/cloudflare/photographybypiv.com.key \
  /etc/caddy/certs/photographybypiv.com.key

echo "==> Verify caddy can read staged keys (no secret output)"
sudo -u caddy test -r /etc/caddy/certs/rockymountainhomesales.com-privkey.pem \
  && echo "OK: RMH key readable by caddy"
sudo -u caddy test -r /etc/caddy/certs/photographybypiv.com.key \
  && echo "OK: PIV key readable by caddy"

echo "==> Validate staged config (does not bind 443)"
caddy validate --config "${STAGED}"

echo "==> Service state (should be disabled/inactive; 443 still k3s)"
systemctl is-enabled caddy 2>&1 || true
systemctl is-active caddy 2>&1 || true
ss -ltn | grep -E ':443|:80 ' || true

echo ""
echo "Done."
echo "  Staged config: ${STAGED}"
echo "  Staged certs:  /etc/caddy/certs/"
echo "  Cutover:       docs/CADDY_MIGRATION_PLAN.md"
