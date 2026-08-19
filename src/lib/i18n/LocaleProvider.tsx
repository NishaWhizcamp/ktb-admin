"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { en, type Dictionary } from "./translations/en";
import { nl } from "./translations/nl";
import { LanguageSelectorModal } from "./LanguageSelectorModal";

export type Locale = "en" | "nl";

const STORAGE_KEY = "ktb-admin-locale";

const dictionaries: Record<Locale, Dictionary> = { en, nl };

interface LocaleContextValue {
  locale: Locale;
  dict: Dictionary;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  // undefined = not yet read from localStorage, null = read but no preference saved
  const [locale, setLocaleState] = useState<Locale | null | undefined>(undefined);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading localStorage is a one-time sync from an external system on mount, not a cascading render
    setLocaleState(stored === "en" || stored === "nl" ? stored : null);
  }, []);

  useEffect(() => {
    if (locale) document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    setLocaleState(next);
  }, []);

  if (locale === undefined) {
    return null;
  }

  if (locale === null) {
    return <LanguageSelectorModal onSelect={setLocale} />;
  }

  return (
    <LocaleContext.Provider value={{ locale, dict: dictionaries[locale], setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return ctx;
}
