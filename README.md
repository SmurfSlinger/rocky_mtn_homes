# Rocky Mountain Homes (Next.js)

Next.js App Router migration of the Rocky Mountain Home Sales site.

## Getting started

```bash
cd /var/www/rocky-mountain-homes-next
cp .env.example .env.local   # add DATABASE_* credentials
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Database

Inventory and home detail pages read from the existing MySQL database (`rocky_mtn_homes`). Configure credentials via `.env.local` (see `.env.example`).

**Static site images** (logo, home hero, about photo) live in `public/css/images/` — copied from the legacy PHP `public/css/images/` tree.

**Listing photos** are served from `public/images/homes` when present, otherwise from `LEGACY_PHP_PUBLIC_PATH` (defaults to the PHP `public` folder) via `/images/homes/[...path]`.

### Staff authentication

- Login: http://localhost:3000/staff/login
- Protected routes: `/staff/*` except `/staff/login`
- Session cookie: signed JWT with `{ adminId, username }` only (no password hash)
- Set `AUTH_SECRET` in `.env.local` (32+ random characters)

### Contact form email

The `/contact` form sends mail via Nodemailer using SMTP settings in `.env.local` (`SMTP_*`, `CONTACT_FROM_*`, `CONTACT_TO_EMAIL`). Credentials stay on the server only.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | ESLint |

## Public routes

- `/` — Home
- `/inventory` — Listings (MySQL)
- `/homes/[id]` — Home detail
- `/contact` — Contact form
- `/about` — About page

Legacy PHP site: `rockymountainhomesales/software_dev/rocky_mtn_homes`

## Deployment

- [Caddy migration plan (replace k3s Traefik)](docs/CADDY_MIGRATION_PLAN.md)
- [HTTPS / Cloudflare / Traefik on this host](docs/DEPLOYMENT_HTTPS_TRAEFIK.md)
- [Server setup examples (systemd + Apache)](docs/DEPLOYMENT_SERVER_SETUP.md)
- [Production environment variables](docs/PRODUCTION_ENV.md)
- [Migration cutover checklist](docs/MIGRATION_CHECKLIST.md)
- [Security audit](docs/SECURITY_AUDIT.md)

Legacy `.php` URLs redirect to App Router paths via `next.config.ts` (see `lib/redirects/php-legacy.ts`).
