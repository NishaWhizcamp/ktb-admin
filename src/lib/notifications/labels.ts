import type { BadgeTone } from "@/components/ui/Badge";
import type { NotificationAudience, NotificationStatus } from "@/lib/supabase/types";

// Display text lives in the locale dictionaries (src/lib/i18n/translations) —
// see dict.enums.audience / dict.enums.status. These tone maps aren't
// language-dependent, so they stay separate.
export const audienceBadgeTone: Record<NotificationAudience, BadgeTone> = {
  all: "green",
  free: "neutral",
  paid: "pink",
  monthly: "pink",
  yearly: "pink",
  expired: "warning",
};

export const statusBadgeTone: Record<NotificationStatus, BadgeTone> = {
  processing: "warning",
  sent: "green",
  partial: "warning",
  failed: "danger",
};
