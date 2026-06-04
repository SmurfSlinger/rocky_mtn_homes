import "server-only";

import { randomBytes } from "crypto";
import fs from "fs/promises";
import path from "path";

export const HOME_IMAGE_UPLOAD_SUBDIR = "images/homes";
export const HOME_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const MIME_TO_EXTENSION: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

/** Extensions that must never be written to disk. */
const BLOCKED_EXTENSIONS = new Set([
  ".php",
  ".php3",
  ".php4",
  ".php5",
  ".phtml",
  ".jsp",
  ".asp",
  ".aspx",
  ".cgi",
  ".exe",
  ".sh",
  ".bat",
  ".cmd",
  ".js",
  ".html",
  ".htm",
  ".svg",
]);

export type HomeImageUploadResult =
  | { ok: true; imagePath: string }
  | { ok: false; error: string };

function extensionFromMime(mimeType: string): string | null {
  return MIME_TO_EXTENSION[mimeType] ?? null;
}

function isBlockedExtension(ext: string): boolean {
  return BLOCKED_EXTENSIONS.has(ext.toLowerCase());
}

/**
 * Saves an uploaded image under public/images/homes with a random filename.
 * DB path format: images/homes/{random}.jpg
 */
export async function saveHomeImageFile(
  file: File,
): Promise<HomeImageUploadResult> {
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return {
      ok: false,
      error: "Only JPEG, PNG, WebP, and GIF images are allowed.",
    };
  }

  if (file.size > HOME_IMAGE_MAX_BYTES) {
    return {
      ok: false,
      error: "Image must be 5 MB or smaller.",
    };
  }

  const ext = extensionFromMime(file.type);
  if (!ext || isBlockedExtension(ext)) {
    return {
      ok: false,
      error: "Unsupported or unsafe image type.",
    };
  }

  const originalExt = path.extname(file.name).toLowerCase();
  if (originalExt && isBlockedExtension(originalExt)) {
    return {
      ok: false,
      error: "Unsupported or unsafe file extension.",
    };
  }

  const filename = `${randomBytes(16).toString("hex")}${ext}`;
  const uploadDir = path.join(process.cwd(), "public", HOME_IMAGE_UPLOAD_SUBDIR);
  await fs.mkdir(uploadDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(uploadDir, filename), buffer);

  return {
    ok: true,
    imagePath: `${HOME_IMAGE_UPLOAD_SUBDIR}/${filename}`,
  };
}
