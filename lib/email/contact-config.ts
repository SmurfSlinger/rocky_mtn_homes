import "server-only";

export type ContactMailConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  fromEmail: string;
  fromName: string;
  toEmail: string;
};

export function getContactMailConfig(): ContactMailConfig | null {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const password = process.env.SMTP_PASSWORD?.trim();
  const fromEmail = process.env.CONTACT_FROM_EMAIL?.trim();
  const toEmail = process.env.CONTACT_TO_EMAIL?.trim();

  if (!host || !user || !password || !fromEmail || !toEmail) {
    return null;
  }

  const port = Number(process.env.SMTP_PORT ?? "587");
  const fromName =
    process.env.CONTACT_FROM_NAME?.trim() ?? "Rocky Mountain Contact Form";

  return {
    host,
    port: Number.isFinite(port) ? port : 587,
    user,
    password,
    fromEmail,
    fromName,
    toEmail,
  };
}
