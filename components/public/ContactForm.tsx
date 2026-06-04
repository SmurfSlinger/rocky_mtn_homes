"use client";

import { submitContactAction } from "@/app/(public)/contact/actions";
import { ContactTurnstile } from "@/components/public/ContactTurnstile";
import type { ContactFormState, ContactHomeOption } from "@/lib/types/contact-form";
import { emptyContactFormValues } from "@/lib/types/contact-form";
import { buttonPrimaryClassName, cardClassName, inputClassName } from "@/lib/ui";
import { useActionState } from "react";

type ContactFormProps = {
  homeOptions: ContactHomeOption[];
  turnstileSiteKey: string | null;
};

export function ContactForm({ homeOptions, turnstileSiteKey }: ContactFormProps) {
  const [state, formAction, pending] = useActionState(submitContactAction, {});
  const v = state.values ?? emptyContactFormValues;
  const errors = state.errors ?? [];
  const success = state.success === true;

  return (
    <div className={`${cardClassName} p-8`}>
      <h2 className="mb-6 text-3xl font-bold text-[#5C4033]">Contact Us</h2>

      {success && (
        <div
          role="status"
          className="mb-4 rounded border border-green-400 bg-green-100 p-4 text-green-700"
        >
          Thank you for your message. We will get back to you as soon as
          possible.
        </div>
      )}

      {errors.length > 0 && (
        <div
          role="alert"
          className="mb-4 rounded border border-red-400 bg-red-100 p-4 text-red-700"
        >
          <ul className="list-disc pl-5">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {!success && (
        <form
          action={formAction}
          className="space-y-5 font-[family-name:var(--font-open-sans)]"
        >
          <div>
            <label htmlFor="name" className="mb-1 block font-semibold">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              defaultValue={v.name}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block font-semibold">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              defaultValue={v.email}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="phone" className="mb-1 block font-semibold">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              defaultValue={v.phone}
              className={inputClassName}
            />
          </div>

          {homeOptions.length > 0 && (
            <div>
              <label htmlFor="home_interest" className="mb-1 block font-semibold">
                Home of interest (optional)
              </label>
              <select
                id="home_interest"
                name="home_interest"
                defaultValue={v.homeInterestId}
                className={inputClassName}
              >
                <option value="">— None —</option>
                {homeOptions.map((home) => (
                  <option key={home.id} value={String(home.id)}>
                    {home.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label htmlFor="message" className="mb-1 block font-semibold">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              defaultValue={v.message}
              className={inputClassName}
            />
          </div>

          <input
            type="text"
            name="website"
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
          />

          <ContactTurnstile
            siteKey={turnstileSiteKey}
            resetKey={errors.length}
          />

          <button
            type="submit"
            disabled={pending || (!turnstileSiteKey && process.env.NODE_ENV === "production")}
            className={`${buttonPrimaryClassName} disabled:opacity-60`}
          >
            {pending ? "Sending…" : "Send Message"}
          </button>
        </form>
      )}
    </div>
  );
}
