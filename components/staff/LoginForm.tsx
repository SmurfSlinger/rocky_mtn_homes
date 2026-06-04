"use client";

import { loginAction, type LoginState } from "@/app/staff/login/actions";
import { inputClassName, buttonPrimaryClassName } from "@/lib/ui";
import { useActionState } from "react";

const initialState: LoginState = {};

type LoginFormProps = {
  redirectFrom?: string;
};

export function LoginForm({ redirectFrom }: LoginFormProps) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {redirectFrom ? (
        <input type="hidden" name="from" value={redirectFrom} />
      ) : null}

      {state.error ? (
        <div
          role="alert"
          className="rounded border border-red-400 bg-red-100 p-4 text-sm text-red-700"
        >
          {state.error}
        </div>
      ) : null}

      <div>
        <label htmlFor="username" className="mb-1 block text-sm font-semibold">
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          required
          autoFocus
          autoComplete="username"
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-semibold">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          autoComplete="current-password"
          className={inputClassName}
        />
      </div>

      <div className="text-center">
        <button
          type="submit"
          disabled={pending}
          className={`${buttonPrimaryClassName} disabled:opacity-60`}
        >
          {pending ? "Signing in…" : "Log In"}
        </button>
      </div>
    </form>
  );
}
