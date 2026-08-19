"use client";

import { Modal } from "./Modal";
import { Button } from "./Button";
import { useLocale } from "@/lib/i18n/LocaleProvider";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel: string;
  destructive?: boolean;
  loading?: boolean;
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  destructive = false,
  loading = false,
}: ConfirmModalProps) {
  const { dict } = useLocale();

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {dict.common.cancel}
          </Button>
          <Button
            variant={destructive ? "destructive" : "primary"}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p>{description}</p>
      {destructive && (
        <p className="mt-2 text-xs font-semibold text-danger">
          {dict.common.cannotBeUndone}
        </p>
      )}
    </Modal>
  );
}
