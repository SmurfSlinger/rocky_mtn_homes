# Server deployment setup (examples only)

**Do not treat this file as applied configuration.** Copy and adapt snippets manually. Do not commit `.env.local` or real secrets.

**App path:** `/var/www/rocky-mountain-homes-next`  
**Environment reference:** [PRODUCTION_ENV.md](./PRODUCTION_ENV.md)  
**Cutover checklist:** [MIGRATION_CHECKLIST.md](./MIGRATION_CHECKLIST.md)

This server currently runs **Apache on port 8080** (HTTP redirect for RMH) and **k3s Traefik on port 443** (HTTPS). Public HTTPS for `rockymountainhomesales.com` must be configured via Traefik `IngressRoute`, not only the Apache SSL vhost. See [DEPLOYMENT_HTTPS_TRAEFIK.md](./DEPLOYMENT_HTTPS_TRAEFIK.md).

---

## 1. Recommended production run method

| Item | Recommendation |
|------|----------------|
| Process manager | **systemd** unit (always-on, restart on failure) |
| Working directory | `/var/www/rocky-mountain-homes-next` |
| Start command | `npm run start` (runs `next start` after `npm run build`) |
| Listen port | **3000** (Next default). Override with `PORT=3001` in the environment if 3000 is taken |
| Env file | `/var/www/rocky-mountain-homes-next/.env.local` (mode `600`, not in git) |
| Build | Run `npm ci` and `npm run build` **before** starting the service (or in a deploy script) |

Run as a dedicated user that can read `.env.local` and write `public/images/homes/` (often `www-data` if uploads should match PHP file ownership).

---

## 2. Example systemd unit

Save as `/etc/systemd/system/rocky-mountain-homes-next.service` (adjust user/paths after review).

```ini
[Unit]
Description=Rocky Mountain Homes Next.js
After=network.target mysql.service
Wants=mysql.service

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/rocky-mountain-homes-next

# Load production env (create on server; never commit)
EnvironmentFile=/var/www/rocky-mountain-homes-next/.env.local
Environment=NODE_ENV=production
Environment=PORT=3000

# Use system Node/npm — verify on this host: which node && which npm
ExecStart=/usr/bin/npm run start

Restart=on-failure
RestartSec=5
TimeoutStopSec=30

# Hardening (optional)
NoNewPrivileges=true

[Install]
WantedBy=multi-user.target
```

### Node / npm caveats

- **Use the same Node that built the app.** On this server, system Node is typically `/usr/bin/node` (check with `which node` and `node -v` before enabling the unit).
- Do not use IDE/Cursor-bundled Node paths in `ExecStart`.
- If `npm run start` fails under systemd, use an explicit start:
  ```ini
  ExecStart=/usr/bin/node /var/www/rocky-mountain-homes-next/node_modules/next/dist/bin/next start -p 3000
  ```
- Ensure `User=` can read `WorkingDirectory`, `.env.local`, and write `public/images/homes/`.

### Example systemctl commands (run manually)

```bash
sudo systemctl daemon-reload
sudo systemctl enable rocky-mountain-homes-next
sudo systemctl start rocky-mountain-homes-next
sudo systemctl status rocky-mountain-homes-next
sudo journalctl -u rocky-mountain-homes-next -f
```

---

## 3. Reverse proxy examples

HTTPS should stay on the **existing** Apache (or Nginx) vhost and certificates (e.g. Let’s Encrypt). Proxy HTTP to Next on `127.0.0.1:3000` only.

### Apache (matches current server)

Enable modules once (example):

```bash
sudo a2enmod proxy proxy_http headers rewrite
sudo systemctl reload apache2
```

**Staging / test port on same host** — separate vhost or port forwarding to Next while production PHP stays live:

```apache
# Example: /etc/apache2/sites-available/rocky-mountain-next-staging.conf
# Use a different ServerName or port for smoke tests before cutover.

<VirtualHost *:8080>
    ServerName next-staging.rockymountainhomesales.com

    ProxyPreserveHost On
    RequestHeader set X-Forwarded-Proto "http"
    RequestHeader set X-Forwarded-For "%{REMOTE_ADDR}s"

    ProxyPass / http://127.0.0.1:3000/
    ProxyPassReverse / http://127.0.0.1:3000/

    ErrorLog ${APACHE_LOG_DIR}/rmh_next_staging_error.log
    CustomLog ${APACHE_LOG_DIR}/rmh_next_staging_access.log combined
</VirtualHost>
```

**Production cutover** — replace PHP `DocumentRoot` handling with a reverse proxy (backup the old vhost first):

```apache
# Example fragment for rockymountainhomesales.com after cutover
# File conceptually similar to 000-rockymountain.conf — adapt; do not blind-copy.

<VirtualHost *:80>
    ServerName rockymountainhomesales.com
    ServerAlias www.rockymountainhomesales.com

    ProxyPreserveHost On
    RequestHeader set X-Forwarded-Proto "http"
    RequestHeader set X-Forwarded-For "%{REMOTE_ADDR}s"

    ProxyPass / http://127.0.0.1:3000/
    ProxyPassReverse / http://127.0.0.1:3000/

    ErrorLog ${APACHE_LOG_DIR}/rhm_error.log
    CustomLog ${APACHE_LOG_DIR}/rhm_access.log combined
</VirtualHost>
```

For **HTTPS** vhosts, set `X-Forwarded-Proto` to `https` and ensure the certificate vhost proxies to the same upstream:

```apache
RequestHeader set X-Forwarded-Proto "https"
```

Next.js legacy `.php` redirects are handled inside the app (`next.config.ts`); Apache does not need to map each `.php` file if all traffic goes to Next.

### Nginx (alternative)

If you use Nginx instead of Apache:

```nginx
# Example server block — adjust server_name and ssl_* to match your cert setup

server {
    listen 443 ssl http2;
    server_name rockymountainhomesales.com www.rockymountainhomesales.com;

    # ssl_certificate ... (existing cert paths)

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

---

## 4. Safe cutover plan

1. **Prepare env** — Create `.env.local` from `.env.example` ([PRODUCTION_ENV.md](./PRODUCTION_ENV.md)): database, `AUTH_SECRET`, SMTP, Turnstile, and listing images (`LEGACY_PHP_PUBLIC_PATH` or copied `public/images/homes`).
2. **Build** — `npm ci && npm run build` in `/var/www/rocky-mountain-homes-next`.
3. **Run on test port first** — Start Next (`PORT=3001 npm run start` or systemd with `PORT=3001`) without changing the public vhost.
4. **Smoke test** (curl or browser via staging vhost / SSH tunnel):
   - `/` — home, hero, logo
   - `/inventory` — DB listings and images
   - `/homes/1` (or a valid id) — detail + gallery
   - `/contact` — form, Turnstile widget, test submission
   - `/staff/login` — staff auth (do not leave test accounts on production)
5. **Freeze PHP staff** — Stop using PHP admin for home/image edits during cutover to avoid dual-write.
6. **Switch proxy** — Point `rockymountainhomesales.com` Apache vhost to `http://127.0.0.1:3000` (or your chosen port); reload Apache.
7. **Keep PHP for rollback** — Leave PHP files on disk; optionally serve PHP on a temporary hostname, alternate port, or restored vhost snippet for emergency rollback.

---

## 5. Rollback plan

| Step | Action |
|------|--------|
| 1 | Restore Apache vhost to PHP `DocumentRoot` (`.../rocky_mtn_homes/public`) from backup |
| 2 | `sudo systemctl stop rocky-mountain-homes-next` (optional) |
| 3 | `sudo systemctl reload apache2` |
| 4 | **Database** — unchanged; no schema rollback required |
| 5 | **Images** — keep `public/images/homes` and PHP `public/images/homes`; no deletion during rollback |

Traffic returns to PHP immediately after proxy restore. Data edited only in Next during the cutover window may differ from PHP’s view—plan a short freeze or reconcile manually if rollback is needed.

---

## 6. Manual deployment commands

Run from the app directory as the deploy user:

```bash
cd /var/www/rocky-mountain-homes-next

# Install exact lockfile dependencies
npm ci

# Production build (required before start)
npm run build

# Optional lint
npm run lint

# Foreground test (Ctrl+C to stop)
npm run start

# Or test on another port without stopping other services
PORT=3001 npm run start
```

**Health checks:**

```bash
curl -sS -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3000/
curl -sS -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3000/inventory
curl -sS -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3000/contact
curl -sS -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3000/staff/login
```

**Listing images (one-time, if not using legacy path only):**

```bash
mkdir -p /var/www/rocky-mountain-homes-next/public/images/homes
rsync -a /var/www/rockymountainhomesales/software_dev/rocky_mtn_homes/public/images/homes/ \
  /var/www/rocky-mountain-homes-next/public/images/homes/
```

**systemd (after creating the unit file):**

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now rocky-mountain-homes-next
sudo systemctl status rocky-mountain-homes-next
```

---

## Proxy choice assumptions (this server)

| Assumption | Detail |
|------------|--------|
| Web server | **Apache** (`000-rockymountain.conf` → PHP `public`) |
| Public hostname | `rockymountainhomesales.com` / `www.rockymountainhomesales.com` |
| Next upstream | `http://127.0.0.1:3000` |
| TLS | Terminated at Apache (existing cert vhosts); forward `X-Forwarded-Proto` |
| Nginx | Not currently in use for this site; snippet provided if you migrate |

---

## Related files in the repo

- `docs/PRODUCTION_ENV.md` — required environment variables  
- `docs/MIGRATION_CHECKLIST.md` — full migration and image strategy  
- `lib/redirects/php-legacy.ts` — in-app `.php` URL redirects  
