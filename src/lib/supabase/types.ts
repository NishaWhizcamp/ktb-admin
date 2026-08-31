export type NotificationAudience =
  | "all"
  | "free"
  | "paid"
  | "monthly"
  | "yearly"
  | "expired";

export type NotificationStatus = "processing" | "sent" | "partial" | "failed";

// Content area a notification points at. Sent to the send-push-notification
// Edge Function as the `type` field; the mobile app uses it to deep-link.
// These string values are the canonical wire values — do not localise them.
export type NotificationType =
  | "Recipe"
  | "Blog"
  | "Video"
  | "Tip"
  | "Season Calendar";

// Managed by the `send-push-notification` Edge Function, which inserts rows
// using the service-role key. The admin panel only ever selects and deletes
// from this table — see src/lib/notifications/api.ts.
export type NotificationRow = {
  id: string;
  title: string;
  description: string;
  audience: NotificationAudience;
  type: NotificationType | null;
  image_path: string | null;
  image_url: string | null;
  status: NotificationStatus;
  users_matched: number;
  tokens_found: number;
  sent_count: number;
  failed_count: number;
  invalid_tokens_count: number;
  errors: Record<string, unknown> | null;
  created_by: string | null;
  created_at: string;
  sent_at: string | null;
};

export type AdminRow = {
  user_id: string;
  email: string;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      notifications: {
        Row: NotificationRow;
        Insert: NotificationRow;
        Update: Partial<NotificationRow>;
        Relationships: [];
      };
      admins: {
        Row: AdminRow;
        Insert: AdminRow;
        Update: Partial<AdminRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
