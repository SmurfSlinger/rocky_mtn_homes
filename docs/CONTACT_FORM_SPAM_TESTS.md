# Contact form — spam filter & Turnstile test cases

Manual checks only. Do **not** submit real flagged messages to production inboxes unless you use a test SMTP recipient.

## Prerequisites

- `.env.local` with valid `DATABASE_*` and SMTP settings for send tests (optional for scoring-only checks).
- Turnstile: add `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` from the Cloudflare Turnstile dashboard, or rely on dev skip when keys are absent.

## Expected behavior summary

| Case | Visitor sees | Email |
|------|----------------|-------|
| Normal inquiry | Success thank-you | Normal subject/body |
| Flagged inquiry | Same success (no score shown) | Subject prefixed with `⚠️ Possible spam/scam —`, warning block + score/reasons in body |
| Honeypot filled | `Spam detected.` | Not sent |
| Invalid/missing Turnstile (prod) | Generic verification error | Not sent |

Server logs include `spamScore`, `reasons`, and `flagged` (never shown on the website).

## Test cases

### 1. Normal inquiry (short message)

- **Input:** Name `Jane Doe`, valid email, phone optional, message `Interested in the Acadia model.`
- **Expected:** Success message; email subject `New Contact Form Message from Jane Doe`; no warning block; `flagged: false` in server log.

### 2. Normal inquiry (minimal message)

- **Input:** Valid name/email, message `Hi` (1 character; passes required validation).
- **Expected:** Success; **not** flagged solely for short length.

### 3. SEO / crypto / backlink language

- **Input:** Message such as `We can improve your SEO rankings with backlinks and crypto investment opportunities.`
- **Expected:** Success on site; email flagged with score ≥ 4; subject includes `⚠️ Possible spam/scam —`; body lists suspicious terms.

### 4. Multiple URLs

- **Input:** Message containing `https://spam1.example` and `https://spam2.example` (or `www.` variants in different fields).
- **Expected:** Flagged (`Multiple URLs detected`); email still sent with warning block.

### 5. Honeypot

- **Input:** Fill hidden `website` field (via devtools) and submit.
- **Expected:** `Spam detected.`; no email; no Turnstile/score log for send.

### 6. Turnstile missing/invalid

- **Production (keys configured):** Submit without completing the widget or with an expired token.
  - **Expected:** User-facing verification error; no email.
- **Development (keys absent):** Submit without widget.
  - **Expected:** Console warning that Turnstile was skipped; normal/scored email flow otherwise.

## Scoring reference

Threshold: **4** (`CONTACT_SPAM_SCORE_THRESHOLD` in `lib/contact-spam-filter.ts`).

| Signal | Points |
|--------|--------|
| 2+ URLs across all fields | +4 |
| Suspicious phrase/term (first +3, extra terms up to +6 total) | +3–6 |
| Message &gt; 3000 characters | +2 |
| Name mostly gibberish/symbols (≥8 chars, conservative) | +2 |
| URL in phone field | +4 |
| Unusual email structure (beyond basic form validation) | +3 |
| Off-platform chat push (Telegram/WhatsApp patterns) | +3 |

## Quick local scoring check (no email)

In Node REPL or a scratch script, import `scoreContactInquiry` from `lib/contact-spam-filter.ts` with sample `ContactFormValues` objects and inspect `{ score, reasons, flagged }` without calling `sendContactEmail`.
