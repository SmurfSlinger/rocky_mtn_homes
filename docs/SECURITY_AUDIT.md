# Security & production-readiness audit

Audit date: 2026-06-03. App path: `/var/www/rocky-mountain-homes-next`.

## Summary

| Area | Status | Notes |
|------|--------|-------|
| Secrets in git | Pass | No credentials in tracked source; `.env.local` gitignored |
| `.env.example` | Pass | Placeholders only; un-ignored via `!.env.example` |
| Staff route protection | Pass | Middleware on `/staff/*` (except login); layout + actions enforce session |
| Write actions server-side | Pass | All mutations use `"use server"`; staff actions call `requireStaffSession()` |
| File upload validation | Pass | MIME whitelist, size cap, blocked extensions, random names |
| Password hashes exposed | Pass | UI uses `AdminPublic`; login uses `lib/db/admins.ts` server-only |
| DB credentials exposed | Pass | `lib/db/connection.ts` is `server-only`; env vars only |
| Missing images (public) | Pass | `resolvePublicImagePath()` → placeholder; gallery fallback |
| PHP URL redirects | Pass | `lib/redirects/php-legacy.ts` + `next.config.ts` |
| robots.txt | Pass | `app/robots.ts` disallows `/staff/` |
| Production build | Pass | `npm run build` |

## Details

### Secrets & environment

- `.gitignore` ignores `.env*` but allows `.env.example`.
- `.env.local` exists locally and is ignored (verified with `git check-ignore`).
- Database and SMTP settings read only from `process.env` in server-only modules.
- No hardcoded passwords or API keys found in application source.

### Staff authentication

- `middleware.ts` matcher: `/staff/:path*`.
- Unauthenticated users redirected to `/staff/login` with optional `?from=` return path.
- Logged-in users hitting login page redirected to `/staff/homes`.
- `(protected)/layout.tsx` calls `requireStaffSession()`.
- Server actions for homes, images, and admins call `requireStaffSession()` (defense in depth beyond middleware).

### Password hashes

- `Admin` type with `hashedPassword` used only in `lib/auth/credentials.ts` and `lib/db/admins.ts` (both server-only).
- Admin management UI uses `AdminPublic` and SQL that omits `hashed_password`.
- JWT session payload: `{ adminId, username }` only.

### File uploads

- `lib/uploads/home-image.ts`: JPEG/PNG/WebP/GIF, 5 MB max, extension blocklist, random hex filenames under `public/images/homes`.
- Legacy media route validates path segments and resolves files only inside `images/homes` roots.

### Public pages

- `mapHomeRow` / `mapHomeImageRow` apply `resolvePublicImagePath()` before data reaches components.
- `buildHomeGalleryPaths()` deduplicates paths and falls back to `/images/placeholder.svg` when empty.
- `public/images/placeholder.svg` used for missing cover/gallery files.

### Contact form

- Honeypot `website` field; server rejects non-empty submissions.
- SMTP credentials never sent to the client; errors are generic.

### Gaps / recommendations (non-blocking)

- **CSRF**: Staff and contact forms rely on SameSite cookies + server actions; explicit CSRF tokens not implemented (PHP was partial).
- **Rate limiting**: Contact form has no application-level rate limit; add at reverse proxy if abused.
- **Session fixation**: New session issued on login (JWT cookie replaced); acceptable for this app size.
- **Dual-write**: Running PHP and Next staff concurrently could conflict; freeze PHP staff at cutover (see migration checklist).
