import type { ContactFormValues } from "@/lib/types/contact-form";

/** Score at or above this value flags the email (still sent). */
export const CONTACT_SPAM_SCORE_THRESHOLD = 4;

export type ContactSpamAssessment = {
  score: number;
  reasons: string[];
  flagged: boolean;
};

const SCAM_PHRASES = [
  "whatsapp only",
  "verify account",
  "urgent payment",
  "cash buyer",
  "cashier check",
  "cashier's check",
  "wire transfer",
  "overpayment",
] as const;

const SCAM_TERMS = [
  "crypto",
  "investment",
  "seo",
  "backlink",
  "ranking",
  "casino",
  "loan",
  "whatsapp",
  "telegram",
  "password",
] as const;

const URL_PATTERN = /https?:\/\/|www\./gi;

const OFF_PLATFORM_PATTERN =
  /(?:contact|message|reach|chat|reply|continue).{0,50}(?:telegram|whatsapp)|(?:telegram|whatsapp).{0,50}(?:only|instead|prefer|exclusively)/i;

function countUrls(text: string): number {
  return (text.match(URL_PATTERN) ?? []).length;
}

function combinedSubmissionText(values: ContactFormValues): string {
  return [
    values.name,
    values.email,
    values.phone,
    values.message,
    values.homeInterestId,
  ].join("\n");
}

function findScamSignals(text: string): string[] {
  const lower = text.toLowerCase();
  const hits: string[] = [];

  for (const phrase of SCAM_PHRASES) {
    if (lower.includes(phrase)) {
      hits.push(`Suspicious phrase: "${phrase}"`);
    }
  }

  for (const term of SCAM_TERMS) {
    const re = new RegExp(`\\b${term}\\b`, "i");
    if (re.test(lower)) {
      hits.push(`Suspicious term: "${term}"`);
    }
  }

  return hits;
}

function isMostlyGibberishName(name: string): boolean {
  const trimmed = name.trim();
  if (trimmed.length < 8) {
    return false;
  }

  const letters = (trimmed.match(/[a-zA-Z]/g) ?? []).length;
  const letterRatio = letters / trimmed.length;
  if (letterRatio < 0.35) {
    return true;
  }

  const vowels = (trimmed.match(/[aeiouAEIOU]/g) ?? []).length;
  if (letters >= 6 && vowels === 0) {
    return true;
  }

  const symbols = (trimmed.match(/[^a-zA-Z0-9\s.'-]/g) ?? []).length;
  if (symbols / trimmed.length > 0.4) {
    return true;
  }

  return false;
}

function hasSuspiciousEmailShape(email: string): boolean {
  const trimmed = email.trim();
  if (URL_PATTERN.test(trimmed)) {
    return true;
  }
  if (trimmed.includes("..") || trimmed.split("@").length !== 2) {
    return true;
  }
  const [local, domain] = trimmed.split("@");
  if (!local || !domain || local.length > 64) {
    return true;
  }
  if (!domain.includes(".") || domain.startsWith(".") || domain.endsWith(".")) {
    return true;
  }
  return false;
}

/**
 * Conservative spam/scam scoring for RMH contact inquiries.
 * Short or minimal messages alone do not increase the score.
 */
export function scoreContactInquiry(
  values: ContactFormValues,
): ContactSpamAssessment {
  const reasons: string[] = [];
  let score = 0;

  const combined = combinedSubmissionText(values);
  const urlCount = countUrls(combined);

  if (urlCount >= 2) {
    score += 4;
    reasons.push(`Multiple URLs detected (${urlCount})`);
  }

  const scamHits = findScamSignals(combined);
  if (scamHits.length > 0) {
    const termScore = Math.min(6, 3 + Math.max(0, scamHits.length - 1));
    score += termScore;
    reasons.push(...scamHits.slice(0, 4));
    if (scamHits.length > 4) {
      reasons.push(`(+${scamHits.length - 4} more suspicious terms)`);
    }
  }

  if (values.message.length > 3000) {
    score += 2;
    reasons.push("Message exceeds 3000 characters");
  }

  if (isMostlyGibberishName(values.name)) {
    score += 2;
    reasons.push("Name appears random or mostly symbols");
  }

  if (values.phone.length > 0 && URL_PATTERN.test(values.phone)) {
    score += 4;
    reasons.push("Phone field contains a URL");
  }

  if (hasSuspiciousEmailShape(values.email)) {
    score += 3;
    reasons.push("Email address has unusual or malformed structure");
  }

  if (OFF_PLATFORM_PATTERN.test(values.message)) {
    score += 3;
    reasons.push("Message pushes off-site chat (Telegram/WhatsApp)");
  }

  const flagged = score >= CONTACT_SPAM_SCORE_THRESHOLD;

  return { score, reasons, flagged };
}
