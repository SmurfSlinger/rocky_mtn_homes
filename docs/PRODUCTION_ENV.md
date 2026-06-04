# Production environment variables

Set these on the server in `.env.local` (or your process manager’s env). Never commit real values. See `.env.example` for a copy-paste template.

## Required in production

| Variable | Required | Notes |
|----------|----------|--------|
| `DATABASE_HOST` | Yes* | MySQL host (e.g. `127.0.0.1`) |
| `DATABASE_PORT` | Yes* | Usually `3306` |
| `DATABASE_USER` | Yes* | DB user with access to `rocky_mtn_homes` |
| `DATABASE_PASSWORD` | Yes* | Quote if it contains `#` (otherwise the rest of the line is treated as a comment) |
| `DATABASE_NAME` | Yes* | Default `rocky_mtn_homes` |
| `DATABASE_URL` | Alt* | Optional single URL instead of `DATABASE_*` fields above — use one approach, not both |
| `AUTH_SECRET` | Yes | Random string, **32+ characters**; signs staff session cookies |
| `SMTP_HOST` | Yes | Outbound mail host (e.g. `smtp.gmail.com`) |
| `SMTP_PORT` | Yes | Usually `587` (STARTTLS) |
| `SMTP_USER` | Yes | SMTP username |
| `SMTP_PASSWORD` | Yes | SMTP password / app password; quote special characters if needed |
| `CONTACT_FROM_EMAIL` | Yes | Sender address for contact form mail |
| `CONTACT_TO_EMAIL` | Yes | Inbox that receives contact submissions |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Yes | Cloudflare Turnstile site key (exposed to browser) |
| `TURNSTILE_SECRET_KEY` | Yes | Turnstile secret; server-only. Contact form is **disabled** in production if either Turnstile key is missing |

\* Provide either `DATABASE_URL` **or** the five `DATABASE_*` fields.

## Optional in production

| Variable | Required | Notes |
|----------|----------|--------|
| `CONTACT_FROM_NAME` | No | Display name for contact mail; defaults to `Rocky Mountain Contact Form` |
| `LEGACY_PHP_PUBLIC_PATH` | No | Absolute path to the **legacy PHP `public` directory** (read-only). Used to serve existing listing photos at `images/homes/*` until they live under this app’s `public/images/homes`. If unset and the default dev path does not exist on the server, only files under Next `public/` are found |

## Not environment variables

| Item | Notes |
|------|--------|
| `NODE_ENV` | Set to `production` when running `npm run start` (Next sets this automatically in production builds) |
| Marketing images | Logo, hero, and about photos are static files in `public/css/images/` (shipped with the repo) — no env var |
| New staff uploads | Written to `public/images/homes/` on disk; directory must exist and be writable by the Node process |

## Development-only behavior

- **Turnstile:** If keys are missing in development, verification is skipped (console warning). This does **not** apply in production.
- **Legacy path default:** Code may fall back to a fixed path under `/var/www/rockymountainhomesales/...` only if that directory exists. On other hosts, set `LEGACY_PHP_PUBLIC_PATH` explicitly.

## Checklist before go-live

1. Copy `.env.example` → `.env.local` and fill all **Required** rows.
2. Confirm MySQL login from the app server (same DB as PHP).
3. Send a test contact message (with Turnstile completed).
4. Log in at `/staff/login` and confirm session cookie works over HTTPS.
5. Confirm listing images load (see [MIGRATION_CHECKLIST.md](./MIGRATION_CHECKLIST.md) image strategy).

## Related docs

- [MIGRATION_CHECKLIST.md](./MIGRATION_CHECKLIST.md) — cutover steps
- [CONTACT_FORM_SPAM_TESTS.md](./CONTACT_FORM_SPAM_TESTS.md) — contact / Turnstile testing
