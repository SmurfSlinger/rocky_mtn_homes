import type { ContactFormValues } from "@/lib/types/contact-form";

export function parseContactFormData(formData: FormData): ContactFormValues {
  return {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim(),
    homeInterestId: String(formData.get("home_interest") ?? "").trim(),
  };
}
