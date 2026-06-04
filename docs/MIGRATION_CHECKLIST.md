# Rocky Mountain Homes — Next.js cutover checklist

Use this when deploying the Next.js app (`rocky-mountain-homes-next`) beside the legacy PHP site and switching production traffic safely.

**Also read:** [PRODUCTION_ENV.md](./PRODUCTION_ENV.md) for every environment variable and whether it is required in production.

## Pre-flight (before any production traffic)

- [ ] **Secrets not in git** — `.env.local` is gitignored; only `.env.example` (placeholders) is tracked.
- [ ] **Production `.env.local`** on the server with all [required variables](./PRODUCTION_ENV.md#required-in-production):
  - Database: `DATABASE_*` or `DATABASE_URL`
  - `AUTH_SECRET` (32+ random characters)
  - Contact email: `SMTP_*`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`
  - Turnstile: `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`
  - Listing images: `LEGACY_PHP_PUBLIC_PATH` **or** copied files under `public/images/homes` (see [Image strategy](#listing-image-strategy))
- [ ] **Node.js** — Use a version compatible with Next.js 16 (upgrade if `npm run build` warns about the engine).
- [ ] **MySQL** — App server can reach the same `rocky_mtn_homes` database as PHP; user has needed DML on app tables.
- [ ] **Writable uploads** — `public/images/homes` exists and is writable by the user running `npm run start`.
- [ ] **Static marketing images** — `public/css/images/` present (logo, hero, about; copied from legacy PHP).
- [ ] **Build on server** — `npm ci && npm run build` succeeds in the deploy directory.
- [ ] **Smoke test (staging)** — Public pages, staff login, home CRUD, gallery upload, admin CRUD, contact form (Turnstile + email).

## Listing image strategy

Listing photos use DB paths like `images/homes/filename.jpg`.

| Approach | When to use | Production behavior |
|----------|-------------|---------------------|
| **A. `LEGACY_PHP_PUBLIC_PATH`** | Parallel run on the same machine as PHP; quickest cutover | Set to the PHP `public` folder (read-only). Existing files are read from legacy disk; **new** staff uploads still go to Next `public/images/homes/`. `resolvePublicImagePath()` and `/images/homes/[...path]` check Next `public/` first, then legacy. |
| **B. Copy into Next `public/images/homes`** | PHP decommissioned or app on a different server | `rsync` or copy all `images/homes/*` from PHP `public` into Next `public/images/homes`. Omit `LEGACY_PHP_PUBLIC_PATH` once everything is copied. |
| **C. Both (recommended at cutover)** | Safest transition | Copy files **and** set `LEGACY_PHP_PUBLIC_PATH` until you verify parity; then remove legacy env after backup. |

Do **not** symlink `public/images/homes` to PHP (Turbopack/build issues). Use copy or `LEGACY_PHP_PUBLIC_PATH`.

Missing files fall back to `/css/images/example_home.jpg` (legacy marketing photo), not a broken image.

## Deploy beside PHP (parallel run)

1. [ ] Deploy app directory (e.g. `/var/www/rocky-mountain-homes-next`).
2. [ ] `npm ci && npm run build && npm run start` (or systemd/PM2) on an internal port (e.g. `3000`).
3. [ ] Point a **staging** vhost or port at Next; keep production on PHP until ready.
4. [ ] Configure [listing images](#listing-image-strategy).
5. [ ] Verify **legacy URL redirects** (301) — configured in `next.config.ts` via `lib/redirects/php-legacy.ts`:

   | Legacy PHP URL | Next route |
   |----------------|------------|
   | `/index.php` | `/` |
   | `/inventory.php` | `/inventory` |
   | `/details.php?id=N` | `/homes/N` |
   | `/details.php` (no id) | `/inventory` |
   | `/contact.php` | `/contact` |
   | `/about.php` | `/about` |
   | `/staff/login.php` | `/staff/login` |
   | `/staff/logout.php` | `/staff/logout` |
   | `/staff/homes/index.php` | `/staff/homes` |
   | `/staff/homes/new.php` | `/staff/homes/new` |
   | `/staff/homes/show.php?id=N` | `/staff/homes/N` |
   | `/staff/homes/edit.php?id=N` | `/staff/homes/N/edit` |
   | `/staff/homes/delete.php?id=N` | `/staff/homes/N/delete` |
   | `/staff/homes/images.php?home_id=N` | `/staff/homes/N/images` |
   | `/staff/homes/images_new.php?home_id=N` | `/staff/homes/N/images/new` |
   | `/staff/homes/images_edit.php?home_id=N&id=M` | `/staff/homes/N/images/M/edit` |
   | `/staff/homes/images_delete.php?home_id=N` | `/staff/homes/N/images` |
   | `/staff/view_admins.php`, `/staff/admins/index.php`, `/staff/index.php` | `/staff/admins` |
   | `/staff/create_admin.php` | `/staff/admins/new` |
   | `/staff/edit_admin.php?id=N` | `/staff/admins/N/edit` |
   | `/staff/delete_admin.php?id=N` | `/staff/admins/N/delete` |

6. [ ] Confirm `/robots.txt` disallows `/staff/`.
7. [ ] Confirm `/staff/*` requires login (middleware + server actions).

## Data and media verification

- [ ] Inventory matches PHP (titles, prices, status).
- [ ] Home detail shows cover + gallery; missing files show legacy fallback image.
- [ ] New staff uploads appear on public pages.
- [ ] Gallery delete updates DB and cleans files when safe.
- [ ] Existing admin `bcrypt` passwords work; new passwords use cost 10.

## Security checklist (production)

- [ ] HTTPS; secrets only in server env ([PRODUCTION_ENV.md](./PRODUCTION_ENV.md)).
- [ ] Staff cookie `httpOnly` + `secure` in production.
- [ ] Contact: honeypot, Turnstile, spam scoring (flagged mail still delivered).
- [ ] Avoid dual-write: do not edit homes in PHP staff while Next is canonical.

## Cutover (switch production to Next)

1. [ ] Optional short maintenance window.
2. [ ] **Freeze PHP staff** — use Next staff only from cutover on.
3. [ ] Point primary vhost/proxy to the Next upstream (`npm run start`).
4. [ ] Legacy `.php` URLs can hit Next (redirects above) or stay on PHP until DNS/proxy switches.
5. [ ] Post-cutover smoke test:
   - [ ] `/`, `/inventory`, `/homes/1`, `/contact`, `/about`
   - [ ] Contact form (Turnstile + inbox)
   - [ ] Staff login, edit home, upload image, logout
6. [ ] Monitor logs for 5xx, DB errors, mail/Turnstile failures.

## Rollback plan

- [ ] Keep PHP codebase and proxy config backed up.
- [ ] Document reverting proxy to PHP within minutes.
- [ ] Same MySQL schema — no migration required for basic cutover.

## After cutover

- [ ] Archive PHP from the live vhost (keep backup).
- [ ] Consolidate all listing images under `public/images/homes`; remove `LEGACY_PHP_PUBLIC_PATH`.
- [ ] Back up DB + `public/images/homes` regularly.
- [ ] Optional: hide sold homes via `getAvailableHomesForPublicInventory()`.

## Commands

```bash
cd /var/www/rocky-mountain-homes-next
cp .env.example .env.local   # edit on server — see PRODUCTION_ENV.md
npm ci
npm run build
npm run start                 # production server (port 3000 default)
npm run lint                  # optional CI check
```

Example listing image copy (if not using legacy path only):

```bash
mkdir -p public/images/homes
rsync -a /path/to/php/public/images/homes/ public/images/homes/
```
