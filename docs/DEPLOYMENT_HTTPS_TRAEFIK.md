# HTTPS, Cloudflare, and Traefik on this server

## What actually listens on port 443

On this host, **public HTTPS (443) is handled by k3s Traefik** (`kube-system/traefik` LoadBalancer + `svclb-traefik`), **not** by Apache.

Evidence:

- `openssl s_client -servername rockymountainhomesales.com` to `127.0.0.1:443` returned **TRAEFIK DEFAULT CERT** before routing was configured.
- HTTPS responses used Go-style `404 page not found` (Traefik), not Apache HTML.
- `photographybypiv.com` already uses a Traefik `IngressRoute` → host port 3000.

Apache:

- Listens on **8080** for RMH HTTP → redirects to HTTPS (`000-rockymountain.conf`).
- Has `rockymountainhomesales.com-le-ssl.conf` for `*:443`, but **does not receive traffic on 443** while Traefik owns the port.
- Certbot certificates under `/etc/letsencrypt/live/rockymountainhomesales.com/` are unused by Traefik until you attach them (see below).

## Fix applied for Rocky Mountain Homes

Traefik route (same pattern as Photography by Piv):

- `deploy/k8s/rocky-mountain-homes.yaml` — Service + Endpoints + IngressRoute
- Backend: host IP `192.168.68.57` port **3002** (systemd `rocky-mountain-homes-next`)
- Hosts: `rockymountainhomesales.com`, `www.rockymountainhomesales.com`

Apply / refresh:

```bash
HOST_IP=$(hostname -I | awk '{print $1}')
sed "s/__HOST_IP__/${HOST_IP}/g" /var/www/rocky-mountain-homes-next/deploy/k8s/rocky-mountain-homes.yaml \
  | kubectl apply -f -
kubectl rollout restart deployment/traefik -n kube-system
kubectl rollout status deployment/traefik -n kube-system
```

Local test:

```bash
curl -sk -H "Host: rockymountainhomesales.com" https://127.0.0.1/ -o /dev/null -w "%{http_code}\n"
# Expect 200
```

## Cloudflare 525 (SSL handshake)

**525** usually means Cloudflare (Full strict) cannot validate the **origin** certificate.

With only `tls: {}` on the IngressRoute, Traefik may present **TRAEFIK DEFAULT CERT**, which is not valid for `rockymountainhomesales.com` → strict mode fails.

### Option A — Cloudflare Origin Certificate (simplest if you use Cloudflare DNS)

1. Cloudflare dashboard → SSL/TLS → Origin Server → create origin cert for `rockymountainhomesales.com` and `www`.
2. Save PEM files on the server (not in git).
3. Create a Kubernetes TLS secret and reference it on the IngressRoute (requires cluster admin):

```bash
# Example only — run manually with your PEM paths
kubectl create secret tls rockymountainhomesales-tls \
  --cert=/path/to/origin.pem \
  --key=/path/to/origin.key \
  -n default
```

Then patch `IngressRoute` spec:

```yaml
tls:
  secretName: rockymountainhomesales-tls
```

Re-apply the manifest and restart Traefik if needed.

### Option B — Use existing Let’s Encrypt files (from Certbot)

Certbot wrote certs for Apache; Traefik can use the same files via a secret:

```bash
sudo kubectl create secret tls rockymountainhomesales-tls \
  --cert=/etc/letsencrypt/live/rockymountainhomesales.com/fullchain.pem \
  --key=/etc/letsencrypt/live/rockymountainhomesales.com/privkey.pem \
  -n default
```

Update `deploy/k8s/rocky-mountain-homes.yaml` `tls.secretName` and re-apply.

Renewal: renew Certbot on the host, then recreate/update the Kubernetes secret after renewal.

### Option C — Traefik ACME (if configured on your cluster)

Only if your k3s Traefik install already has a certificate resolver; not documented here.

## Apache SSL vhost

`rockymountainhomesales.com-le-ssl.conf` can remain for documentation or future use if port 443 is ever moved back to Apache. **It does not affect current public HTTPS** while Traefik binds 443.

Do **not** disable `default-ssl.conf` unless you understand Apache is not serving 443 at all on this host.

## Manual checks (router / WAN)

If external tests still fail after local `curl` returns 200:

1. Confirm public IP reaches **this** server (same as `192.168.68.57` on LAN).
2. Port-forward **443** on the router to this host (if behind NAT).
3. Cloudflare DNS A/AAAA records point to the correct public IP.
4. Cloudflare SSL mode: **Full (strict)** only after origin presents a valid cert (see above).
5. Compare:
   - `curl -sk -H "Host: rockymountainhomesales.com" https://127.0.0.1/`
   - `curl -sk --resolve "rockymountainhomesales.com:443:PUBLIC_IP" https://rockymountainhomesales.com/`

## Orphan Traefik processes

If routing breaks after reboot, see Photography by Piv `deploy/traefik-fix-443.sh` (stale `traefik traefik` PIDs vs k3s rollout). Run manually with sudo if needed; do not kill processes blindly without checking `ss -tlnp` and k3s pod status.
