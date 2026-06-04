import "server-only";

import type { ContactSpamAssessment } from "@/lib/contact-spam-filter";
import { getContactMailConfig } from "@/lib/email/contact-config";
import type { ContactFormValues } from "@/lib/types/contact-form";
import nodemailer from "nodemailer";

export type SendContactEmailOptions = {
  homeTitle: string | null;
  spam: ContactSpamAssessment;
};

export class ContactMailNotConfiguredError extends Error {
  constructor() {
    super("Contact email is not configured.");
    this.name = "ContactMailNotConfiguredError";
  }
}

function buildPlainTextBody(
  values: ContactFormValues,
  homeTitle: string | null,
  spam: ContactSpamAssessment,
): string {
  const lines: string[] = [];

  if (spam.flagged) {
    lines.push(
      "*** POSSIBLE SPAM / SCAM ***",
      "This contact form submission was flagged by automated checks.",
      "Review carefully before replying or clicking any links.",
      "",
      `Spam score: ${spam.score}`,
      "Reasons:",
      ...spam.reasons.map((r) => `  - ${r}`),
      "",
      "--- Original message ---",
      "",
    );
  } else {
    lines.push(
      "You have received a new message from the contact form on your website.",
      "",
    );
  }

  lines.push(
    `Name: ${values.name}`,
    `Email: ${values.email}`,
    `Phone: ${values.phone || "(not provided)"}`,
  );

  if (homeTitle) {
    lines.push(`Home of interest: ${homeTitle} (ID ${values.homeInterestId})`);
  }

  lines.push("", "Message:", values.message);

  return lines.join("\n");
}

export async function sendContactEmail(
  values: ContactFormValues,
  options: SendContactEmailOptions,
): Promise<void> {
  const { homeTitle, spam } = options;
  const config = getContactMailConfig();
  if (!config) {
    throw new ContactMailNotConfiguredError();
  }

  const transport = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: {
      user: config.user,
      pass: config.password,
    },
  });

  const subject = spam.flagged
    ? `⚠️ Possible spam/scam — New Contact Form Message from ${values.name}`
    : `New Contact Form Message from ${values.name}`;
  const text = buildPlainTextBody(values, homeTitle, spam);

  await transport.sendMail({
    from: `"${config.fromName}" <${config.fromEmail}>`,
    to: config.toEmail,
    replyTo: `"${values.name}" <${values.email}>`,
    subject,
    text,
  });
}
