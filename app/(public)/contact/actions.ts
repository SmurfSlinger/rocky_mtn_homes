"use server";

import { scoreContactInquiry } from "@/lib/contact-spam-filter";
import { parseContactFormData } from "@/lib/contact/parse-contact-form";
import {
  ContactMailNotConfiguredError,
  sendContactEmail,
} from "@/lib/email/send-contact-email";
import { getHomeById } from "@/lib/db/homes";
import { verifyTurnstileToken } from "@/lib/turnstile/verify-turnstile";
import type { ContactFormState } from "@/lib/types/contact-form";
import { validateContactForm } from "@/lib/validation/contact";

function failure(
  errors: string[],
  values: ReturnType<typeof parseContactFormData>,
): ContactFormState {
  return { errors, values };
}

export async function submitContactAction(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const honeypot = String(formData.get("website") ?? "").trim();
  if (honeypot.length > 0) {
    return { errors: ["Spam detected."] };
  }

  const turnstileResult = await verifyTurnstileToken(
    String(formData.get("cf-turnstile-response") ?? ""),
  );
  if (!turnstileResult.ok) {
    return failure([turnstileResult.userMessage], parseContactFormData(formData));
  }

  const values = parseContactFormData(formData);
  const errors = validateContactForm(values);

  if (errors.length > 0) {
    return failure(errors, values);
  }

  let homeTitle: string | null = null;
  if (values.homeInterestId.length > 0) {
    const homeId = Number(values.homeInterestId);
    const home = await getHomeById(homeId);
    if (!home) {
      return failure(["Please select a valid home from the list."], values);
    }
    homeTitle = home.title;
  }

  const spam = scoreContactInquiry(values);
  console.info("[contact] submission scored", {
    spamScore: spam.score,
    reasons: spam.reasons,
    flagged: spam.flagged,
    turnstileSkipped: turnstileResult.skipped === true,
  });

  try {
    await sendContactEmail(values, { homeTitle, spam });
    return { success: true };
  } catch (error) {
    if (error instanceof ContactMailNotConfiguredError) {
      return failure(
        [
          "Contact email is temporarily unavailable. Please call us at 435-749-0270.",
        ],
        values,
      );
    }

    console.error("Contact form email failed:", error);
    return failure(
      [
        "Message could not be sent. Please try again later or call us at 435-749-0270.",
      ],
      values,
    );
  }
}
