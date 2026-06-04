import "server-only";

import { siteAssets } from "@/lib/site-assets";
import fs from "fs";
import path from "path";

const PLACEHOLDER = siteAssets.missingListingImage;

function legacyPublicRoot(): string | null {
  const configured = process.env.LEGACY_PHP_PUBLIC_PATH?.trim();
  if (configured) {
    return configured;
  }
  const defaultLegacy =
    "/var/www/rockymountainhomesales/software_dev/rocky_mtn_homes/public";
  return fs.existsSync(defaultLegacy) ? defaultLegacy : null;
}

function fileExists(relativePath: string): boolean {
  const relative = relativePath.replace(/^\/+/, "");
  const nextPublic = path.join(process.cwd(), "public", relative);
  if (fs.existsSync(nextPublic)) {
    return true;
  }

  const legacy = legacyPublicRoot();
  if (legacy) {
    const legacyPath = path.join(legacy, relative);
    if (fs.existsSync(legacyPath)) {
      return true;
    }
  }

  return false;
}

/**
 * Resolves a DB-relative path (e.g. `images/homes/file.jpg`) to a public URL,
 * falling back to a placeholder when the file is missing — same behavior as PHP
 * `safe_image_path()`.
 */
export function resolvePublicImagePath(
  imagePath: string | null | undefined,
): string {
  const trimmed = (imagePath ?? "").trim();
  if (!trimmed) {
    return PLACEHOLDER;
  }

  const relative = trimmed.replace(/^\/+/, "");

  if (!fileExists(relative)) {
    return PLACEHOLDER;
  }

  return `/${relative}`;
}
