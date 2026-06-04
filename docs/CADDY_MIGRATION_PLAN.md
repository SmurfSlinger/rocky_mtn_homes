# Caddy migration plan (replace k3s Traefik)

**Status:** Prepared only — no cutover applied yet.

**Goal:** `Cloudflare → Caddy :443 → Next.js (127.0.0.1:3000 / :3002)` and remove k3s from the public web path.

**Do not touch:** Minecraft Docker containers, Cloudflare DNS/dashboard (manual), PHP files, `.env.local`.

---

## Current state (audit snapshot)

| Item | Status |
|------|--------|
| **Port 443** | **k3s Traefik** (`svclb-traefik` / `kube-system/traefik` LoadBalancer) |
| **Port 8080** | **Apache** (RMH HTTP → HTTPS redirect) |
| **Port 3000** | **photography-by-piv** (systemd, active) |
| **Port 3002** | **rocky-mountain-homes-next** (systemd, active) |
| **Port 80** | Not listening on host (no public HTTP listener) |
| **25577 / 19132** | **Docker** velocity (Minecraft) — independent of k3s |
| **k3s** | **active (running)**, **disabled at boot** |
| **Caddy** | **Not installed** |
| **RAM** | ~15 GiB total; ~11 GiB used; k3s ~610 MiB; Minecraft ~7+ GiB |

**Traefik IngressRoutes (only public web use of k3s):**

- `photographybypiv.com` → `192.168.68.57:3000`
- `rockymountainhomesales.com` → `192.168.68.57:3002`

**Apache:** Installed; SSL vhosts exist but **do not receive 443 traffic** while k3s holds the port. After Caddy cutover, leave Apache stopped or disable `Listen 443` in `ports.conf` to avoid accidental bind fights.

**kylergundersen.com:** Apache SSL `DocumentRoot` is `/var/www/kylergundersen` (directory is **empty** on disk). HTTP vhost points at `/var/www/html` (assignment folders). **Confirm intended content before enabling** in Caddy.

---

## Proposed files (repo)

| File | Purpose |
|------|---------|
| `deploy/caddy/Caddyfile.proposed` | Site blocks + commented TLS choices |
| `docs/CADDY_MIGRATION_PLAN.md` | This document |

**Not applied:** `/etc/caddy/Caddyfile` — copy only during cutover.

---

## Install and stage (without cutover)

Run once with sudo (installs Caddy, stages `Caddyfile.next`, keeps k3s on 443):

```bash
sudo bash /var/www/rocky-mountain-homes-next/deploy/caddy/install-and-stage.sh
```

Staged config in repo: `deploy/caddy/Caddyfile.next` → copied to `/etc/caddy/Caddyfile.next`.

The install script copies TLS material into `/etc/caddy/certs/` (`root:caddy`, mode `640`) so the `caddy` user can read keys without touching LE archive permissions.

Live `/etc/caddy/Caddyfile` is a **placeholder** on `:2019` only; `caddy` service is **disabled** until cutover.

**If the script fails with `$'\r': command not found` or `set: invalid option`:** the file has Windows CRLF line endings. Fix on the server:

```bash
sed -i 's/\r$//' /var/www/rocky-mountain-homes-next/deploy/caddy/install-and-stage.sh \
  /var/www/rocky-mountain-homes-next/deploy/caddy/Caddyfile.next
```

---

## Install Caddy (Ubuntu — manual commands)

Official stable packages (from [Caddy docs](https://caddyserver.com/docs/install#debian-ubuntu-raspbian)):

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' \
  | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' \
  | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
caddy version
sudo systemctl enable caddy
```

Caddy defaults: config `/etc/caddy/Caddyfile`, user `caddy`, ports **80** and **443** when configured for HTTPS.

---

## Proposed Caddyfile (summary)

See `deploy/caddy/Caddyfile.proposed`.

| Hostnames | Backend |
|-----------|---------|
| `rockymountainhomesales.com`, `www` | `reverse_proxy 127.0.0.1:3002` |
| `photographybypiv.com`, `www` | `reverse_proxy 127.0.0.1:3000` |
| `kylergundersen.com`, `www` | `file_server` → `/var/www/kylergundersen` (verify content) |

**Headers:** Caddy sets `X-Forwarded-*` for `reverse_proxy` automatically. The staged `Caddyfile.next` does **not** use `trusted_proxies cloudflare` (not in the apt `caddy` package). Behind orange-cloud, use `CF-Connecting-IP` in the app if you need the visitor IP, or build a custom Caddy with a CDN-ranges plugin later.

**Host header:** Preserved by default for `reverse_proxy` (required for Next.js).

---

## Certificate strategy recommendation

### Recommended for first cutover: **Option B — existing files on disk**

| Site | Material | Cloudflare mode |
|------|----------|-----------------|
| **RMH** | Certbot paths under `/etc/letsencrypt/live/rockymountainhomesales.com/` (already issued for Apache) | **Full (strict)** if cert is valid public LE |
| **PIV** | Cloudflare origin cert paths from Apache: `/etc/ssl/cloudflare/photographybypiv.com.pem` + `.key` | **Full (strict)** with origin cert |
| **Kyler** | Certbot paths under `/etc/letsencrypt/live/kylergundersen.com/` if present | **Full (strict)** if enabled |

Uncomment the `tls ...` lines in `Caddyfile.proposed` after verifying files exist (`sudo ls` only).

**Why not immediate Caddy ACME (Option A) on day one?**

- Domains are **orange-clouded**; HTTP-01 on port 80 often **fails** unless Cloudflare allows challenge traffic or you **gray-cloud** temporarily.
- Port **443 is occupied by Traefik** until cutover; you cannot test Caddy ACME before the handoff window.
- PIV already uses **Cloudflare origin certs** — reusing them is lowest risk.

### Later: **Option A — Caddy automatic HTTPS**

- Use after k3s is gone and Caddy owns **80/443**.
- For orange-cloud: configure **Cloudflare DNS-01** (`acme_dns cloudflare`) with API token in `/etc/caddy/.env` or systemd drop-in (never commit tokens).
- Or briefly **gray-cloud** the hostnames during HTTP-01 issuance.

| Cloudflare SSL mode | When |
|---------------------|------|
| **Full (strict)** | Valid public LE on origin, or valid Cloudflare origin cert |
| **Full** | Self-signed origin only (not recommended long term) |

**Orange cloud during issuance:** Keep orange for cutover if using **existing certs**. For new ACME, either DNS challenge (stay orange) or gray-cloud + HTTP-01 (temporary).

---

## Apache during and after migration

| Phase | Apache |
|-------|--------|
| Before cutover | Can stay running on **8080** only |
| Cutover | Stop conflicting listeners: consider `sudo systemctl stop apache2` **or** remove `Listen 443` and disable SSL sites so Apache does not grab 443 when k3s stops |
| After stable | Optional: disable Apache entirely for web, or keep for local-only tools |

Caddy should be the **only** process on **443** (and **80** if you use redirects or ACME).

---

## Pre-cutover checklist

- [ ] `systemctl is-active rocky-mountain-homes-next photography-by-piv`
- [ ] `curl -sI http://127.0.0.1:3000/` and `:3002/` → **200**
- [ ] `curl -sk -H "Host: rockymountainhomesales.com" https://127.0.0.1/` → **200** (Traefik baseline)
- [ ] `curl -sk -H "Host: photographybypiv.com" https://127.0.0.1/` → **200**
- [ ] Install Caddy (commands above)
- [ ] Verify TLS files exist for each site you enable
- [ ] Copy proposed Caddyfile → `/etc/caddy/Caddyfile`, uncomment correct `tls` lines
- [ ] `sudo caddy validate --config /etc/caddy/Caddyfile`
- [ ] **Do not start Caddy on 443** while k3s is still bound (validate config only, or use `caddy run --adapter caddyfile` on **8443** for dry-run if needed)

### Optional dry-run on alternate port (advanced)

Run Caddy with a one-off config listening on **8443** only (not in proposed file) to test backends without touching 443 — only if you need extra confidence.

---

## Cutover procedure (maintenance window)

**Estimated downtime:** 2–10 minutes for HTTPS if rehearsed.

### 1. Backup

```bash
sudo cp -a /etc/caddy /etc/caddy.bak.$(date +%Y%m%d) 2>/dev/null || true
sudo cp -a /etc/apache2/sites-available /etc/apache2/sites-available.bak.$(date +%Y%m%d)
kubectl get ingressroute -A -o yaml > ~/ingressroute-backup-$(date +%Y%m%d).yaml
```

### 2. Install and configure Caddy (if not done)

```bash
# install per section above
sudo cp /var/www/rocky-mountain-homes-next/deploy/caddy/Caddyfile.proposed /etc/caddy/Caddyfile
# edit: uncomment tls lines, set email if using ACME
sudo caddy validate --config /etc/caddy/Caddyfile
```

### 3. Stop competing edge services

```bash
# Release 443 (and prefer 80 for Caddy)
sudo systemctl stop k3s
# IMPORTANT: systemctl stop alone often leaves Traefik/svclb on :443 — Cloudflare 521/525 until these die
sudo /usr/local/bin/k3s-killall.sh
sudo systemctl stop apache2

# No traefik process should remain
pgrep -a traefik || echo "OK: no traefik"

sudo ss -ltn | grep -E ':443|:80 '
```

### 4. Start Caddy

```bash
sudo systemctl start caddy
sudo systemctl status caddy
sudo ss -ltn | grep -E ':443|:80 '
```

### 5. Local tests

```bash
curl -sI http://127.0.0.1:3000/
curl -sI http://127.0.0.1:3002/

curl -Ik -H "Host: rockymountainhomesales.com" https://127.0.0.1/
curl -Ik -H "Host: www.rockymountainhomesales.com" https://127.0.0.1/
curl -Ik -H "Host: photographybypiv.com" https://127.0.0.1/
curl -Ik -H "Host: rockymountainhomesales.com" https://127.0.0.1/inventory

# TLS on the WAN IP (what Cloudflare hits) — must NOT be TRAEFIK DEFAULT CERT
PUBLIC_IP=$(curl -4 -s ifconfig.me)
echo | openssl s_client -connect "${PUBLIC_IP}:443" -servername rockymountainhomesales.com 2>/dev/null \
  | openssl x509 -noout -subject
```

### 6. External test (bypass Cloudflare)

```bash
PUBLIC_IP=$(curl -4 -s ifconfig.me)
curl -Ik --resolve "rockymountainhomesales.com:443:${PUBLIC_IP}" https://rockymountainhomesales.com/
curl -Ik --resolve "photographybypiv.com:443:${PUBLIC_IP}" https://photographybypiv.com/
```

### 7. Cloudflare test

- Confirm SSL mode **Full (strict)** (or **Full** if using origin certs only).
- Browser: both sites load, staff login, contact form, galleries.

**521 only on one site while origin is healthy:** Caddy may be fine; Cloudflare may be pointing that zone at the wrong **origin IP** (often the old LAN IP `192.168.68.57` from the k3s Traefik setup). Compare:

```bash
PUBLIC_IP=$(curl -4 -s ifconfig.me)
# Must be 200 — origin TLS + Caddy
curl -sS -o /dev/null -w 'direct:%{http_code}\n' \
  --resolve "rockymountainhomesales.com:443:${PUBLIC_IP}" https://rockymountainhomesales.com/

# Through Cloudflare edge (use any A record IP from dig @1.1.1.1)
curl -sS -o /dev/null -w 'via_cf:%{http_code}\n' \
  --resolve 'rockymountainhomesales.com:443:104.21.85.211' https://rockymountainhomesales.com/
```

If `direct:200` and `via_cf:521`, fix **Cloudflare DNS** for that zone: proxied **A** records for `@` and `www` must be **`PUBLIC_IP`**, not a private LAN address. `photographybypiv.com` working via CF while RMH returns 521 is a strong sign only the RMH zone origin IP is wrong.

### 8. Decommission k3s (only after both sites work)

```bash
sudo systemctl stop k3s
sudo systemctl disable k3s
# optional later: kubectl delete ingressroute ..., uninstall k3s package
```

Verify Minecraft still works (`25577`, `19132` unchanged).

---

## Rollback procedure

If Caddy or certs fail:

```bash
sudo systemctl stop caddy
sudo systemctl stop apache2

sudo systemctl start k3s
# wait for Traefik pod
kubectl rollout status deployment/traefik -n kube-system --timeout=120s

curl -sk -H "Host: rockymountainhomesales.com" https://127.0.0.1/ -o /dev/null -w "%{http_code}\n"
curl -sk -H "Host: photographybypiv.com" https://127.0.0.1/ -o /dev/null -w "%{http_code}\n"
```

Optional: `sudo systemctl start apache2` (8080 only).

**No database or Next app changes** required for rollback.

---

## What breaks if k3s stops before Caddy is ready

| Service | Effect |
|---------|--------|
| **rockymountainhomesales.com HTTPS** | **Down** |
| **photographybypiv.com HTTPS** | **Down** |
| **kylergundersen.com HTTPS** | **Down** (already 404 via Traefik today) |
| **Next on 3000/3002** | Still running; only unreachable publicly on 443 |
| **Minecraft** | **Unaffected** |
| **Cloudflare** | **525/502** to origin |

This is the critical ordering: **have Caddy configured and ready to start in the same window as `stop k3s`**.

---

## Risks

| Risk | Mitigation |
|------|------------|
| Port 443 bind race (Apache + Caddy + k3s) | `stop k3s` **and** `k3s-killall.sh`, then Apache; verify with `ss` and `pgrep traefik` |
| ACME fails behind Cloudflare | Use existing cert files first (Option B) |
| Traefik still on 443 after `stop k3s` / Cloudflare 521 or 525 | Run `sudo /usr/local/bin/k3s-killall.sh`, then `systemctl restart caddy`; confirm LE/origin cert on `PUBLIC_IP:443` |
| Caddy cannot read TLS keys | Ensure `caddy` user ACL (`sudo setfacl` or group read on cert files) |
| kyler site empty | Disable kyler block in Caddyfile until content confirmed |
| k3s re-enabled at boot | Keep `systemctl disable k3s`; k3s already disabled at boot today |
| RMH Apache 8080 redirect unused | Add Caddy `:80` redirects later or leave Cloudflare HTTPS-only |

---

## Memory savings after k3s removal

Stopping k3s frees roughly **600–650 MiB RAM** plus CPU. Caddy typically adds **~30–80 MiB** — net savings ~500+ MiB.

---

## Related docs

- [DEPLOYMENT_HTTPS_TRAEFIK.md](./DEPLOYMENT_HTTPS_TRAEFIK.md) — why Traefik owned 443
- [DEPLOYMENT_SERVER_SETUP.md](./DEPLOYMENT_SERVER_SETUP.md) — systemd Next apps (update after Caddy cutover)
- [PRODUCTION_ENV.md](./PRODUCTION_ENV.md) — app env vars (unchanged)

---

## After successful cutover (follow-up, not required day one)

- Remove `deploy/k8s/rocky-mountain-homes.yaml` IngressRoute from cluster (optional).
- Uninstall k3s if no longer needed (`/usr/local/bin/k3s-uninstall.sh` — **destructive**, plan separately).
- Disable Apache or remove `Listen 443` from `ports.conf`.
- Update README/deployment docs to say **Caddy** is the edge proxy.
- Consider headlamp/metrics-server removal if k3s is uninstalled.
