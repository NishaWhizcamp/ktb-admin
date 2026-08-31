"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Bell, Loader2, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { formatDateTime } from "@/lib/format";
import { deleteNotification, getAdminEmail, getNotification } from "@/lib/notifications/api";
import { audienceBadgeTone, statusBadgeTone, typeBadgeTone } from "@/lib/notifications/labels";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import type { NotificationRow } from "@/lib/supabase/types";

function ViewNotificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { showToast } = useToast();
  const { locale, dict } = useLocale();

  const [notification, setNotification] = useState<NotificationRow | null | undefined>(undefined);
  const [creatorEmail, setCreatorEmail] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const load = useCallback(async () => {
    if (!id) {
      setNotification(null);
      return;
    }
    setNotification(undefined);
    const row = await getNotification(id);
    setNotification(row);

    if (row?.created_by) {
      const email = await getAdminEmail(row.created_by);
      setCreatorEmail(email);
    } else {
      setCreatorEmail(null);
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load is an async data fetch; its setState calls resolve after the effect body returns
    load();
  }, [load]);

  async function handleConfirmDelete() {
    if (!notification) return;
    setActionLoading(true);
    try {
      const { fileWarning } = await deleteNotification(notification);
      if (fileWarning) {
        showToast("error", dict.notificationView.deleteFileWarningToast);
      } else {
        showToast("success", dict.notificationView.deleteSuccessToast);
      }
      router.replace("/notifications");
    } catch {
      showToast("error", dict.notificationView.deleteErrorToast);
      setActionLoading(false);
    }
  }

  if (notification === undefined) {
    return (
      <div>
        <PageHeader title={dict.notificationView.pageTitle} />
        <div className="flex items-center justify-center py-24">
          <Loader2 size={28} className="animate-spin text-pink-500" />
        </div>
      </div>
    );
  }

  if (notification === null) {
    return (
      <div>
        <PageHeader title={dict.notificationView.pageTitle} />
        <EmptyState
          icon={Bell}
          title={dict.notificationView.notFoundTitle}
          description={dict.notificationView.notFoundDescription}
          action={
            <Link href="/notifications">
              <Button variant="secondary">{dict.notificationView.backToListing}</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={dict.notificationView.pageTitle} />

      <div className="p-8 max-w-2xl">
        <Link
          href="/notifications"
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary mb-5"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          {dict.notificationView.backToListing}
        </Link>

        <div className="rounded-[20px] bg-surface shadow-[var(--shadow-card)] p-6 flex flex-col gap-6">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-xl font-semibold text-text-primary">{notification.title}</h2>
            <Badge tone={statusBadgeTone[notification.status]}>
              {dict.enums.status[notification.status]}
            </Badge>
          </div>

          <div>
            <p className="section-label mb-2">{dict.notificationView.descriptionLabel}</p>
            <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
              {notification.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Field label={dict.notificationView.audienceLabel}>
              <Badge tone={audienceBadgeTone[notification.audience]}>
                {dict.enums.audience[notification.audience]}
              </Badge>
            </Field>
            <Field label={dict.notificationView.typeLabel}>
              {notification.type ? (
                <Badge tone={typeBadgeTone[notification.type]}>
                  {dict.enums.notificationType[notification.type]}
                </Badge>
              ) : (
                "—"
              )}
            </Field>
            <Field label={dict.notificationView.createdByLabel}>{creatorEmail ?? "—"}</Field>
            <Field label={dict.notificationView.createdDateLabel}>
              {formatDateTime(notification.created_at, locale)}
            </Field>
            <Field label={dict.notificationView.sentDateLabel}>
              {formatDateTime(notification.sent_at, locale)}
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <Field label={dict.notificationView.usersMatchedLabel}>{notification.users_matched}</Field>
            <Field label={dict.notificationView.sentLabel}>{notification.sent_count}</Field>
            <Field label={dict.notificationView.failedLabel}>{notification.failed_count}</Field>
          </div>

          {notification.image_path && (
            <div>
              <p className="section-label mb-2">{dict.notificationView.imageLabel}</p>
              {notification.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={notification.image_url}
                  alt={notification.title}
                  className="max-w-xs rounded-[16px] border border-border"
                />
              ) : (
                <p className="text-sm text-text-muted">{dict.notificationView.imageUnavailable}</p>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="destructive" onClick={() => setPendingDelete(true)}>
            <Trash2 size={16} strokeWidth={1.5} />
            {dict.notificationView.deleteButton}
          </Button>
        </div>
      </div>

      <ConfirmModal
        open={pendingDelete}
        onClose={() => setPendingDelete(false)}
        onConfirm={handleConfirmDelete}
        loading={actionLoading}
        title={dict.notificationView.deleteModalTitle}
        description={dict.notificationView.deleteModalDescription}
        confirmLabel={dict.notificationView.deleteConfirmLabel}
        destructive
      />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium text-text-muted mb-1">{label}</p>
      <div className="text-sm text-text-primary font-medium">{children}</div>
    </div>
  );
}

export default function ViewNotificationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-24">
          <Loader2 size={28} className="animate-spin text-pink-500" />
        </div>
      }
    >
      <ViewNotificationContent />
    </Suspense>
  );
}
