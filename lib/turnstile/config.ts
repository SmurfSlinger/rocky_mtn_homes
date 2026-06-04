import "server-only";

export type TurnstileServerConfig = {
  siteKey: string;
  secretKey: string;
  enabled: true;
};

function envTrim(value: string | undefined): string {
  return (value ?? "").replace(/\r/g, "").trim();
}

export function getPublicTurnstileSiteKey(): string | null {
  const key = envTrim(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
  return key.length > 0 ? key : null;
}

export function getTurnstileServerConfig(): TurnstileServerConfig | null {
  const siteKey = getPublicTurnstileSiteKey();
  const secretKey = envTrim(process.env.TURNSTILE_SECRET_KEY);
  if (!siteKey || !secretKey) {
    return null;
  }
  return { siteKey, secretKey, enabled: true };
}

/** True when both Turnstile keys are set. */
export function isTurnstileConfigured(): boolean {
  return getTurnstileServerConfig() !== null;
}

/**
 * In development only, allow submissions when Turnstile keys are not configured.
 * Production always requires configured keys.
 */
export function canSkipTurnstileInDevelopment(): boolean {
  return process.env.NODE_ENV === "development" && !isTurnstileConfigured();
}
