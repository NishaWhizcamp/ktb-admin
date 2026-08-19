"use client";

import type { Locale } from "./LocaleProvider";
import { en } from "./translations/en";
import { nl } from "./translations/nl";

const options: { locale: Locale; label: string; heading: string; subheading: string }[] = [
  { locale: "en", label: "English", heading: en.languageSelector.heading, subheading: en.languageSelector.subheading },
  { locale: "nl", label: "Nederlands", heading: nl.languageSelector.heading, subheading: nl.languageSelector.subheading },
];

export function LanguageSelectorModal({ onSelect }: { onSelect: (locale: Locale) => void }) {
  return (
    <div className="min-h-screen header-gradient flex items-center justify-center px-4">
      <div className="w-full max-w-[420px] flex flex-col items-center">
        <div className="mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Bloom" className="h-14 w-auto" />
        </div>

        <div className="w-full rounded-[20px] bg-surface p-8 shadow-[var(--shadow-card)]">
          <h1 className="text-2xl font-bold text-pink-600 mb-1">
            {options[0].heading} / {options[1].heading}
          </h1>
          <p className="text-sm text-text-secondary mb-6">
            {options[0].subheading}
          </p>

          <div className="flex flex-col gap-3">
            {options.map((option) => (
              <button
                key={option.locale}
                type="button"
                onClick={() => onSelect(option.locale)}
                className="w-full h-12 rounded-xl border border-border bg-surface text-sm font-semibold text-text-primary hover:bg-bg hover:border-pink-500 transition-colors"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
