"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export default function LoginPage() {
  const { session, loading, signIn } = useAuth();
  const { dict } = useLocale();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && session) {
      router.replace("/notifications");
    }
  }, [loading, session, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) errors.email = dict.login.emailRequired;
    if (!password) errors.password = dict.login.passwordRequired;
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    const { error } = await signIn(email.trim(), password);
    setSubmitting(false);

    if (error) {
      setFormError(dict.login.invalidCredentials);
      return;
    }
    router.replace("/notifications");
  }

  return (
    <div className="min-h-screen header-gradient flex items-center justify-center px-4">
      <div className="w-full max-w-[400px] flex flex-col items-center">
        <div className="mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Bloom" className="h-14 w-auto" />
        </div>

        <div className="w-full rounded-[20px] bg-surface p-8 shadow-[var(--shadow-card)]">
          <h1 className="text-2xl font-bold text-pink-600 mb-1">{dict.login.title}</h1>
          <p className="text-sm text-text-secondary mb-6">
            {dict.login.subtitle}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <Input
              id="email"
              type="email"
              label={dict.login.emailLabel}
              placeholder={dict.login.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={fieldErrors.email}
              autoComplete="email"
            />
            <Input
              id="password"
              type="password"
              label={dict.login.passwordLabel}
              placeholder={dict.login.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={fieldErrors.password}
              autoComplete="current-password"
            />

            {formError && (
              <p className="text-xs text-danger" role="alert">
                {formError}
              </p>
            )}

            <Button type="submit" loading={submitting} className="w-full mt-2">
              {submitting ? dict.login.submitting : dict.login.submit}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
