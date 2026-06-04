"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          theme?: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        },
      ) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

type ContactTurnstileProps = {
  siteKey: string | null;
  /** Change when the form fails so the widget can be completed again. */
  resetKey?: number;
};

export function ContactTurnstile({ siteKey, resetKey = 0 }: ContactTurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tokenInputRef = useRef<HTMLInputElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    if (!siteKey || !scriptReady || !containerRef.current || !window.turnstile) {
      return;
    }

    if (widgetIdRef.current) {
      try {
        window.turnstile.reset(widgetIdRef.current);
      } catch {
        containerRef.current.innerHTML = "";
      }
      widgetIdRef.current = null;
    }

    if (tokenInputRef.current) {
      tokenInputRef.current.value = "";
    }

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme: "light",
      callback: (token) => {
        if (tokenInputRef.current) {
          tokenInputRef.current.value = token;
        }
      },
      "expired-callback": () => {
        if (tokenInputRef.current) {
          tokenInputRef.current.value = "";
        }
      },
      "error-callback": () => {
        if (tokenInputRef.current) {
          tokenInputRef.current.value = "";
        }
      },
    });
  }, [siteKey, scriptReady, resetKey]);

  if (!siteKey) {
    if (process.env.NODE_ENV === "development") {
      return (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-[#5C4033]">Security check</p>
          <p className="rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
            Turnstile is not configured. Add{" "}
            <code className="text-xs">NEXT_PUBLIC_TURNSTILE_SITE_KEY</code> and{" "}
            <code className="text-xs">TURNSTILE_SECRET_KEY</code> to{" "}
            <code className="text-xs">.env.local</code> (see{" "}
            <code className="text-xs">.env.example</code>). In development,
            submissions still work without verification.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <p className="text-sm font-semibold text-[#5C4033]">Security check</p>
        <p
          role="alert"
          className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-900"
        >
          The contact form is temporarily unavailable. Please call{" "}
          <a href="tel:4357490270" className="font-semibold underline">
            435-749-0270
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-[#5C4033]">Security check *</p>
      <input
        ref={tokenInputRef}
        type="hidden"
        name="cf-turnstile-response"
        defaultValue=""
      />
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />
      <div ref={containerRef} className="min-h-[65px]" />
    </div>
  );
}
