import type { ContactFormValues } from "@/lib/types/contact-form";

const NAME_MIN = 2;
const NAME_MAX = 255;
const MESSAGE_MIN = 1;
const MESSAGE_MAX = 10000;
const PHONE_MAX = 50;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Loose phone check: digits/plus/parens/dashes/spaces, at least 7 digits if non-empty. */
function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

export function validateContactForm(values: ContactFormValues): string[] {
  const errors: string[] = [];
  const name = values.name.trim();
  const email = values.email.trim();
  const phone = values.phone.trim();
  const message = values.message.trim();

  if (name.length < NAME_MIN || name.length > NAME_MAX) {
    errors.push("Name is required.");
  }

  if (email.length === 0) {
    errors.push("Email is required.");
  } else if (!isValidEmail(email)) {
    errors.push("Email format is invalid.");
  }

  if (phone.length > PHONE_MAX) {
    errors.push("Phone number is too long.");
  } else if (phone.length > 0 && !isValidPhone(phone)) {
    errors.push("Please enter a valid phone number.");
  }

  if (message.length < MESSAGE_MIN || message.length > MESSAGE_MAX) {
    errors.push("Message is required.");
  }

  const homeId = values.homeInterestId.trim();
  if (homeId.length > 0) {
    const id = Number(homeId);
    if (!Number.isInteger(id) || id <= 0) {
      errors.push("Please select a valid home from the list.");
    }
  }

  return errors;
}
