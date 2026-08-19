import { supabase } from "@/lib/supabase/client";
import { IMAGES_BUCKET, PAGE_SIZE } from "@/lib/constants";
import type {
  NotificationAudience,
  NotificationRow,
  NotificationStatus,
} from "@/lib/supabase/types";

export interface ListNotificationsParams {
  status: NotificationStatus | "all";
  audience: NotificationAudience | "all";
  search: string;
  page: number;
}

export interface ListNotificationsResult {
  rows: NotificationRow[];
  count: number;
}

interface AdminNotificationsResponse {
  success: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  notifications: NotificationRow[];
}

// Delegates to the get-admin-notifications Edge Function (service-role key),
// since the admin panel's authenticated client is subject to the
// notifications table's RLS policies.
export async function listNotifications({
  status,
  audience,
  search,
  page,
}: ListNotificationsParams): Promise<ListNotificationsResult> {
  const body: Record<string, string | number> = {
    page: page + 1,
    limit: PAGE_SIZE,
  };

  if (status !== "all") body.status = status;
  if (audience !== "all") body.audience = audience;
  if (search.trim()) body.search = search.trim();

  const { data, error } = await supabase.functions.invoke<AdminNotificationsResponse>(
    "get-admin-notifications",
    { body }
  );
  if (error) throw error;
  if (!data?.success) throw new Error("Failed to load notifications.");

  return { rows: data.notifications, count: data.pagination.total };
}

export async function getNotification(id: string): Promise<NotificationRow | null> {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getAdminEmail(userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("admins")
    .select("email")
    .eq("user_id", userId)
    .maybeSingle();
  if (error || !data) return null;
  return data.email;
}

export async function deleteNotification(
  notification: NotificationRow
): Promise<{ fileWarning: boolean }> {
  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("id", notification.id);
  if (error) throw error;

  let fileWarning = false;
  if (notification.image_path) {
    const { error: removeError } = await supabase.storage
      .from(IMAGES_BUCKET)
      .remove([notification.image_path]);
    if (removeError) fileWarning = true;
  }

  return { fileWarning };
}

export interface SendPushNotificationParams {
  audience: NotificationAudience;
  title: string;
  description: string;
  image?: File | null;
}

export interface SendPushNotificationResult {
  success: boolean;
  notification_id: string;
  status: NotificationStatus;
  audience: NotificationAudience;
  title: string;
  image_path: string | null;
  image_url: string | null;
  users_matched: number;
  tokens_found: number;
  sent: number;
  failed: number;
  invalid_tokens_deactivated: number;
  errors: Record<string, unknown>;
}

// Delegates the entire flow — image upload, row creation, and the actual
// FCM push — to the send-push-notification Edge Function. The admin panel
// never writes to `notifications` or `notification-images` directly.
export async function sendPushNotification({
  audience,
  title,
  description,
  image,
}: SendPushNotificationParams): Promise<SendPushNotificationResult> {
  const body: FormData | Record<string, string> = image
    ? (() => {
        const formData = new FormData();
        formData.append("audience", audience);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("image", image);
        return formData;
      })()
    : { audience, title, description };

  const { data, error } = await supabase.functions.invoke("send-push-notification", {
    body,
  });
  if (error) throw error;
  return data as SendPushNotificationResult;
}
