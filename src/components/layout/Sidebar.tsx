"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, LogOut } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useLocale, type Locale } from "@/lib/i18n/LocaleProvider";

const languageOptions: { locale: Locale; label: string }[] = [
  { locale: "en", label: "EN" },
  { locale: "nl", label: "NL" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { locale, dict, setLocale } = useLocale();
  const active = pathname?.startsWith("/notifications");

  return (
    <aside className="w-[240px] shrink-0 bg-surface border-r border-border flex flex-col h-screen sticky top-0">
      <div className="flex items-center px-5 h-16 border-b border-border">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Bloom" className="h-8 w-auto" />
      </div>

      <nav className="flex-1 px-3 py-4">
        <Link
          href="/notifications"
          className={clsx(
            "flex items-center gap-3 rounded-xl px-3 h-11 text-sm font-medium transition-colors",
            active
              ? "bg-green-200 text-green-700"
              : "text-text-secondary hover:bg-bg"
          )}
        >
          <Bell size={20} strokeWidth={1.5} />
          {dict.sidebar.notifications}
        </Link>
      </nav>

      <div className="border-t border-border p-4 flex flex-col gap-3">
        <div>
          <p className="text-xs font-medium text-text-muted mb-1.5">{dict.sidebar.language}</p>
          <div className="flex gap-1.5" role="radiogroup" aria-label={dict.sidebar.language}>
            {languageOptions.map((option) => (
              <button
                key={option.locale}
                type="button"
                role="radio"
                aria-checked={locale === option.locale}
                onClick={() => setLocale(option.locale)}
                className={clsx(
                  "h-8 flex-1 rounded-lg text-xs font-semibold transition-colors border",
                  locale === option.locale
                    ? "bg-green-200 text-green-700 border-green-200"
                    : "bg-surface text-text-secondary border-border hover:bg-bg"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-text-muted truncate" title={user?.email ?? ""}>
          {user?.email}
        </p>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-danger transition-colors"
        >
          <LogOut size={16} strokeWidth={1.5} />
          {dict.sidebar.logout}
        </button>
      </div>
    </aside>
  );
}
