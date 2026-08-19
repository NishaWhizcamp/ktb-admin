import type { Locale } from "@/lib/i18n/LocaleProvider";

const localeTags: Record<Locale, string> = {
  en: "en-GB",
  nl: "nl-NL",
};

export function formatDateTime(iso: string | null, locale: Locale = "en"): string {
  if (!iso) return "—";
  const date = new Date(iso);
  const tag = localeTags[locale];
  const datePart = date.toLocaleDateString(tag, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const timePart = date.toLocaleTimeString(tag, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${datePart}, ${timePart}`;
}
