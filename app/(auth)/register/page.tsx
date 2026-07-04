"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { register, type RegisterActionState } from "../actions";

export default function RegisterPage() {
  const router = useRouter();
  const [state, formAction] = useActionState<RegisterActionState, FormData>(
    register,
    { error: undefined, success: false }
  );

  if (state?.success) {
    router.push("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-border/30 bg-card/50 p-8 backdrop-blur-sm shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Start using Orphentis AI today
          </p>
        </div>

        <form action={formAction} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full rounded-lg border border-border/30 bg-background/50 px-3 py-2 text-sm focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full rounded-lg border border-border/30 bg-background/50 px-3 py-2 text-sm focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="••••••••"
              />
            </div>
          </div>

          {state?.error && (
            <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500">
              {state.error}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] hover:shadow-blue-500/30"
          >
            Create account
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <a href="/login" className="font-medium text-blue-500 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}