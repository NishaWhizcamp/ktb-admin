"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { RadioPills } from "@/components/ui/RadioPills";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { FileUpload } from "@/components/notifications/FileUpload";
import { useToast } from "@/components/ui/Toast";
import { sendPushNotification } from "@/lib/notifications/api";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { DESCRIPTION_MAX_LENGTH, TITLE_MAX_LENGTH } from "@/lib/constants";
import type { NotificationAudience, NotificationType } from "@/lib/supabase/types";
import type { Dictionary } from "@/lib/i18n/translations/en";

function buildAudienceOptions(
  dict: Dictionary
): { value: NotificationAudience; label: string }[] {
  return [
    { value: "all", label: dict.enums.audience.all },
    { value: "free", label: dict.enums.audience.free },
    { value: "paid", label: dict.enums.audience.paid },
    { value: "monthly", label: dict.enums.audience.monthly },
    { value: "yearly", label: dict.enums.audience.yearly },
    { value: "expired", label: dict.enums.audience.expired },
  ];
}

const NOTIFICATION_TYPES: NotificationType[] = [
  "Recipe",
  "Blog",
  "Video",
  "Tip",
  "Season Calendar",
];

export default function CreateNotificationPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { dict } = useLocale();
  const audienceOptions = buildAudienceOptions(dict);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [audience, setAudience] = useState<NotificationAudience>("all");
  const [type, setType] = useState<NotificationType>("Recipe");
  const [file, setFile] = useState<File | null>(null);

  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function validate(): boolean {
    const nextErrors: { title?: string; description?: string } = {};
    if (!title.trim()) nextErrors.title = dict.notificationCreate.titleRequired;
    else if (title.length > TITLE_MAX_LENGTH)
      nextErrors.title = dict.notificationCreate.titleTooLong(TITLE_MAX_LENGTH);

    if (!description.trim()) nextErrors.description = dict.notificationCreate.descriptionRequired;
    else if (description.length > DESCRIPTION_MAX_LENGTH)
      nextErrors.description = dict.notificationCreate.descriptionTooLong(DESCRIPTION_MAX_LENGTH);

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setShowConfirm(true);
  }

  async function handleConfirmSend() {
    setSubmitting(true);
    try {
      const result = await sendPushNotification({
        audience,
        title: title.trim(),
        description: description.trim(),
        type,
        image: file,
      });

      if (result.status === "sent") {
        showToast("success", dict.notificationCreate.sentToast(result.sent, result.tokens_found));
      } else if (result.status === "partial") {
        showToast("error", dict.notificationCreate.partialToast(result.sent, result.failed));
      } else if (result.status === "failed") {
        showToast("error", dict.notificationCreate.failedToast);
      } else {
        showToast("success", dict.notificationCreate.processingToast);
      }

      router.replace("/notifications");
    } catch {
      showToast("error", dict.notificationCreate.sendErrorToast);
      setSubmitting(false);
      setShowConfirm(false);
    }
  }

  return (
    <div>
      <PageHeader title={dict.notificationCreate.pageTitle} />

      <div className="p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
          <div>
            <Input
              id="title"
              label={dict.notificationCreate.titleLabel}
              placeholder={dict.notificationCreate.titlePlaceholder}
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, TITLE_MAX_LENGTH + 20))}
              error={errors.title}
              maxLength={TITLE_MAX_LENGTH + 20}
            />
            <p className="mt-1 text-xs text-text-muted text-right">
              {title.length}/{TITLE_MAX_LENGTH}
            </p>
          </div>

          <div>
            <Textarea
              id="description"
              label={dict.notificationCreate.descriptionLabel}
              rows={4}
              placeholder={dict.notificationCreate.descriptionPlaceholder}
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, DESCRIPTION_MAX_LENGTH + 50))}
              error={errors.description}
            />
            <p className="mt-1 text-xs text-text-muted text-right">
              {description.length}/{DESCRIPTION_MAX_LENGTH}
            </p>
          </div>

          <RadioPills
            label={dict.notificationCreate.audienceLabel}
            options={audienceOptions}
            value={audience}
            onChange={setAudience}
          />

          <Select
            id="type"
            label={dict.notificationCreate.typeLabel}
            value={type}
            onChange={(e) => setType(e.target.value as NotificationType)}
          >
            {NOTIFICATION_TYPES.map((option) => (
              <option key={option} value={option}>
                {dict.enums.notificationType[option]}
              </option>
            ))}
          </Select>

          <FileUpload
            file={file}
            onSelect={setFile}
            onRemove={() => setFile(null)}
            disabled={submitting}
          />

          <div className="flex gap-3 pt-2">
            <Button type="submit" variant="accent">
              {dict.notificationCreate.createButton}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push("/notifications")}
            >
              {dict.notificationCreate.cancelButton}
            </Button>
          </div>
        </form>
      </div>

      <Modal
        open={showConfirm}
        onClose={() => (!submitting ? setShowConfirm(false) : undefined)}
        title={dict.notificationCreate.confirmTitle}
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowConfirm(false)} disabled={submitting}>
              {dict.notificationCreate.cancelButton}
            </Button>
            <Button variant="accent" onClick={handleConfirmSend} loading={submitting}>
              {submitting ? dict.notificationCreate.sendingButton : dict.notificationCreate.confirmSendButton}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-xs font-medium text-text-muted mb-0.5">{dict.notificationCreate.confirmTitleField}</p>
            <p className="text-sm text-text-primary font-medium">{title}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-text-muted mb-0.5">{dict.notificationCreate.confirmAudienceField}</p>
            <p className="text-sm text-text-primary font-medium">{dict.enums.audience[audience]}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-text-muted mb-0.5">{dict.notificationCreate.confirmTypeField}</p>
            <p className="text-sm text-text-primary font-medium">{dict.enums.notificationType[type]}</p>
          </div>
          {file && (
            <div>
              <p className="text-xs font-medium text-text-muted mb-0.5">{dict.notificationCreate.confirmImageField}</p>
              <p className="text-sm text-text-primary font-medium">{file.name}</p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
