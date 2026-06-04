import { assertSafePathSegments } from "@/lib/uploads/safe-path-segments";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

function legacyPublicRoot(): string | null {
  const configured = process.env.LEGACY_PHP_PUBLIC_PATH?.trim();
  if (configured && fs.existsSync(configured)) {
    return configured;
  }
  const fallback =
    "/var/www/rockymountainhomesales/software_dev/rocky_mtn_homes/public";
  return fs.existsSync(fallback) ? fallback : null;
}

function isPathWithinRoot(filePath: string, rootDir: string): boolean {
  const resolved = path.resolve(filePath);
  const root = path.resolve(rootDir);
  return resolved === root || resolved.startsWith(`${root}${path.sep}`);
}

function resolveFileOnDisk(segments: string[]): string | null {
  const relative = path.join("images", "homes", ...segments);
  const nextRoot = path.join(process.cwd(), "public", "images", "homes");
  const nextPath = path.join(process.cwd(), "public", relative);
  if (
    isPathWithinRoot(nextPath, nextRoot) &&
    fs.existsSync(nextPath)
  ) {
    return nextPath;
  }

  const legacy = legacyPublicRoot();
  if (legacy) {
    const legacyRoot = path.join(legacy, "images", "homes");
    const legacyPath = path.join(legacy, relative);
    if (
      isPathWithinRoot(legacyPath, legacyRoot) &&
      fs.existsSync(legacyPath)
    ) {
      return legacyPath;
    }
  }

  return null;
}

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await context.params;

  if (!assertSafePathSegments(segments)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const filePath = resolveFileOnDisk(segments);

  if (!filePath) {
    return new NextResponse("Not found", { status: 404 });
  }

  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": MIME[ext] ?? "application/octet-stream",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
