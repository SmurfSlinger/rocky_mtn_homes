import "server-only";

import {
  canSkipTurnstileInDevelopment,
  getTurnstileServerConfig,
  isTurnstileConfigured,
} from "@/lib/turnstile/config";

type TurnstileVerifyResult =
  | { ok: true; skipped?: boolean }
  | { ok: false; userMessage: string };

type TurnstileSiteverifyResponse = {
  success?: boolean;
  "error-codes"?: string[];
};

export async function verifyTurnstileToken(
  token: string | null | undefined,
): Promise<TurnstileVerifyResult> {
  if (canSkipTurnstileInDevelopment()) {
    console.warn(
      "[contact] Turnstile keys missing — verification skipped in development. " +
        "Add NEXT_PUBLIC_TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY to .env.local (see .env.example).",
    );
    return { ok: true, skipped: true };
  }

  if (!isTurnstileConfigured()) {
    console.error("[contact] Turnstile is not configured in production.");
    return {
      ok: false,
      userMessage:
        "Contact form is temporarily unavailable. Please call us at 435-749-0270.",
    };
  }

  const trimmed = (token ?? "").trim();
  if (!trimmed) {
    return {
      ok: false,
      userMessage:
        "We could not verify your submission. Please complete the security check and try again.",
    };
  }

  const config = getTurnstileServerConfig();
  if (!config) {
    return {
      ok: false,
      userMessage:
        "Contact form is temporarily unavailable. Please call us at 435-749-0270.",
    };
  }

  let response: Response;
  try {
    response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: config.secretKey,
          response: trimmed,
        }),
      },
    );
  } catch (error) {
    console.error("[contact] Turnstile verification request failed:", error);
    return {
      ok: false,
      userMessage:
        "We could not verify your submission. Please try again in a moment.",
    };
  }

  let data: TurnstileSiteverifyResponse;
  try {
    data = (await response.json()) as TurnstileSiteverifyResponse;
  } catch {
    return {
      ok: false,
      userMessage:
        "We could not verify your submission. Please try again in a moment.",
    };
  }

  if (!data.success) {
    console.warn("[contact] Turnstile rejected token:", data["error-codes"]);
    return {
      ok: false,
      userMessage:
        "We could not verify your submission. Please refresh the page and try again.",
    };
  }

  return { ok: true };
}
