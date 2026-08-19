"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE_BYTES } from "@/lib/constants";
import { useLocale } from "@/lib/i18n/LocaleProvider";

interface FileUploadProps {
  file: File | null;
  onSelect: (file: File) => void;
  onRemove: () => void;
  uploading?: boolean;
  disabled?: boolean;
}

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileUpload({ file, onSelect, onRemove, uploading, disabled }: FileUploadProps) {
  const { dict } = useLocale();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  function validateAndSelect(candidate: File) {
    setError(null);

    if (!ALLOWED_IMAGE_TYPES.includes(candidate.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
      setError(dict.notificationCreate.onlyJpegPng);
      return;
    }
    if (candidate.size > MAX_IMAGE_SIZE_BYTES) {
      setError(dict.notificationCreate.imageTooLarge);
      return;
    }

    setPreviewUrl(URL.createObjectURL(candidate));
    onSelect(candidate);
  }

  function handleRemove() {
    setError(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (inputRef.current) inputRef.current.value = "";
    onRemove();
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-text-secondary">
        {dict.notificationCreate.imageLabel}{" "}
        <span className="text-text-muted">{dict.notificationCreate.imageOptional}</span>
        {" · "}
        <span className="text-text-muted">
          {dict.notificationCreate.maxImageSize(formatSize(MAX_IMAGE_SIZE_BYTES))}
        </span>
      </span>

      {!file && (
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 rounded-xl border border-dashed border-border bg-surface px-4 h-11 text-sm text-text-secondary hover:bg-bg disabled:opacity-50 w-fit"
        >
          <ImagePlus size={16} strokeWidth={1.5} />
          {dict.notificationCreate.chooseImage}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_IMAGE_TYPES.join(",")}
        className="hidden"
        onChange={(e) => {
          const selected = e.target.files?.[0];
          if (selected) validateAndSelect(selected);
        }}
      />

      {file && previewUrl && (
        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3 w-fit max-w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Image preview"
            className="h-12 w-12 rounded-[12px] object-cover shrink-0"
          />
          <div className="min-w-0">
            <p className="text-sm font-medium text-text-primary truncate max-w-[200px]">
              {file.name}
            </p>
            <p className="text-xs text-text-muted">{formatSize(file.size)}</p>
          </div>
          {uploading ? (
            <Loader2 size={18} className="animate-spin text-pink-500 shrink-0" />
          ) : (
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              aria-label={dict.notificationCreate.removeImageAria}
              className="text-text-muted hover:text-danger shrink-0"
            >
              <X size={18} />
            </button>
          )}
        </div>
      )}

      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
