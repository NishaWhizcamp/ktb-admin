"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Plus,
  RotateCcw,
  Search,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { EmptyState } from "@/components/ui/EmptyState";
import { TableRowSkeleton } from "@/components/ui/Skeleton";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { AttachmentCell } from "@/components/notifications/AttachmentCell";
import { useToast } from "@/components/ui/Toast";
import { useDebouncedValue } from "@/lib/useDebouncedValue";
import { formatDateTime } from "@/lib/format";
import { deleteNotification, listNotifications } from "@/lib/notifications/api";
import { audienceBadgeTone, statusBadgeTone, typeBadgeTone } from "@/lib/notifications/labels";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { PAGE_SIZE } from "@/lib/constants";
import type {
  NotificationAudience,
  NotificationRow,
  NotificationStatus,
} from "@/lib/supabase/types";

type StatusFilter = NotificationStatus | "all";
type AudienceFilter = NotificationAudience | "all";

export default function NotificationsListPage() {
  const { showToast } = useToast();
  const { locale, dict } = useLocale();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [audienceFilter, setAudienceFilter] = useState<AudienceFilter>("all");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const [page, setPage] = useState(0);

  const [rows, setRows] = useState<NotificationRow[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [pendingDelete, setPendingDelete] = useState<NotificationRow | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listNotifications({
        status: statusFilter,
        audience: audienceFilter,
        search: debouncedSearch,
        page,
      });
      setRows(result.rows);
      setCount(result.count);
    } catch {
      setError("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, audienceFilter, debouncedSearch, page]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resetting pagination is a direct consequence of the filters changing, not a cascading render
    setPage(0);
  }, [statusFilter, audienceFilter, debouncedSearch]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetchRows is an async data fetch; its setState calls resolve after the effect body returns
    fetchRows();
  }, [fetchRows]);

  async function handleConfirmDelete() {
    if (!pendingDelete) return;
    setActionLoading(true);
    try {
      const { fileWarning } = await deleteNotification(pendingDelete);
      if (fileWarning) {
        showToast("error", dict.notificationsList.deleteFileWarningToast);
      } else {
        showToast("success", dict.notificationsList.deleteSuccessToast);
      }
      setPendingDelete(null);
      fetchRows();
    } catch {
      showToast("error", dict.notificationsList.deleteErrorToast);
    } finally {
      setActionLoading(false);
    }
  }

  const hasFilters = statusFilter !== "all" || audienceFilter !== "all" || search.trim() !== "";
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  return (
    <div>
      <PageHeader
        title={dict.notificationsList.pageTitle}
        action={
          <Link href="/notifications/create">
            <Button variant="accent">
              <Plus size={16} strokeWidth={2} />
              {dict.notificationsList.createButton}
            </Button>
          </Link>
        }
      />

      <div className="p-8">
        <div className="flex flex-wrap items-end gap-3 mb-5">
          <div className="flex-1 min-w-[220px] flex flex-col gap-1.5">
            <label htmlFor="search" className="text-xs font-medium text-text-secondary">
              {dict.notificationsList.searchLabel}
            </label>
            <div className="relative">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                id="search"
                type="text"
                placeholder={dict.notificationsList.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-surface pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-pink-500/40 focus:border-pink-500"
              />
            </div>
          </div>

          <Select
            label={dict.notificationsList.statusLabel}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="w-[160px]"
          >
            <option value="all">{dict.notificationsList.filterAll}</option>
            <option value="processing">{dict.enums.status.processing}</option>
            <option value="sent">{dict.enums.status.sent}</option>
            <option value="partial">{dict.enums.status.partial}</option>
            <option value="failed">{dict.enums.status.failed}</option>
          </Select>

          <Select
            label={dict.notificationsList.audienceLabel}
            value={audienceFilter}
            onChange={(e) => setAudienceFilter(e.target.value as AudienceFilter)}
            className="w-[160px]"
          >
            <option value="all">{dict.notificationsList.filterAll}</option>
            <option value="free">{dict.enums.audience.free}</option>
            <option value="paid">{dict.enums.audience.paid}</option>
            <option value="monthly">{dict.enums.audience.monthly}</option>
            <option value="yearly">{dict.enums.audience.yearly}</option>
            <option value="expired">{dict.enums.audience.expired}</option>
          </Select>
        </div>

        <div className="rounded-[20px] bg-surface shadow-[var(--shadow-card)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-bg text-left">
                  <Th>{dict.notificationsList.columns.title}</Th>
                  <Th>{dict.notificationsList.columns.description}</Th>
                  <Th>{dict.notificationsList.columns.audience}</Th>
                  <Th>{dict.notificationsList.columns.type}</Th>
                  <Th>{dict.notificationsList.columns.image}</Th>
                  <Th>{dict.notificationsList.columns.status}</Th>
                  <Th>{dict.notificationsList.columns.created}</Th>
                  <Th>{dict.notificationsList.columns.sent}</Th>
                </tr>
              </thead>
              <tbody>
                {loading &&
                  Array.from({ length: 6 }).map((_, i) => (
                    <TableRowSkeleton key={i} columns={8} />
                  ))}

                {!loading && !error && rows.length > 0 &&
                  rows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-border last:border-b-0 hover:bg-green-50 transition-colors"
                    >
                      <td className="px-4 py-3 font-semibold text-text-primary w-[200px] max-w-[200px] whitespace-normal break-words">
                        {row.title}
                      </td>
                      <td className="px-4 py-3 text-text-secondary w-[280px] max-w-[280px] whitespace-normal break-words">
                        {row.description}
                      </td>
                      <td className="px-4 py-3">
                        <Badge tone={audienceBadgeTone[row.audience]}>
                          {dict.enums.audience[row.audience]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {row.type ? (
                          <Badge tone={typeBadgeTone[row.type]}>
                            {dict.enums.notificationType[row.type]}
                          </Badge>
                        ) : (
                          <span className="text-text-muted">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <AttachmentCell imagePath={row.image_path} imageUrl={row.image_url} />
                      </td>
                      <td className="px-4 py-3">
                        <Badge tone={statusBadgeTone[row.status]}>
                          {dict.enums.status[row.status]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                        {formatDateTime(row.created_at, locale)}
                      </td>
                      <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                        {formatDateTime(row.sent_at, locale)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {!loading && error && (
            <EmptyState
              icon={RotateCcw}
              title={dict.notificationsList.errorTitle}
              description={dict.notificationsList.errorDescription}
              action={
                <Button variant="secondary" onClick={fetchRows}>
                  {dict.notificationsList.retryButton}
                </Button>
              }
            />
          )}

          {!loading && !error && rows.length === 0 && hasFilters && (
            <EmptyState
              icon={Search}
              title={dict.notificationsList.emptyFilteredTitle}
              description={dict.notificationsList.emptyFilteredDescription}
            />
          )}

          {!loading && !error && rows.length === 0 && !hasFilters && (
            <EmptyState
              icon={Bell}
              title={dict.notificationsList.emptyTitle}
              description={dict.notificationsList.emptyDescription}
              action={
                <Link href="/notifications/create">
                  <Button variant="accent">
                    <Plus size={16} strokeWidth={2} />
                    {dict.notificationsList.createFirstButton}
                  </Button>
                </Link>
              }
            />
          )}
        </div>

        {!loading && !error && count > 0 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-text-muted">
              {dict.notificationsList.showingRange(
                page * PAGE_SIZE + 1,
                Math.min(count, (page + 1) * PAGE_SIZE),
                count
              )}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                aria-label={dict.notificationsList.previousPage}
                className="p-2 rounded-lg border border-border bg-surface disabled:opacity-40 hover:bg-bg"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs text-text-secondary">
                {dict.notificationsList.pageOf(page + 1, totalPages)}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                aria-label={dict.notificationsList.nextPage}
                className="p-2 rounded-lg border border-border bg-surface disabled:opacity-40 hover:bg-bg"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
        loading={actionLoading}
        title={dict.notificationsList.deleteModalTitle}
        description={dict.notificationsList.deleteModalDescription}
        confirmLabel={dict.notificationsList.deleteConfirmLabel}
        destructive
      />
    </div>
  );
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-muted ${className ?? ""}`}
    >
      {children}
    </th>
  );
}
