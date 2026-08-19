"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { useLocale } from "@/lib/i18n/LocaleProvider";

interface ImagePreviewModalProps {
  open: boolean;
  onClose: () => void;
  src: string;
  alt: string;
}

export function ImagePreviewModal({ open, onClose, src, alt }: ImagePreviewModalProps) {
  const { dict } = useLocale();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[#1f2421]/70" onClick={onClose} aria-hidden />
      <div role="dialog" aria-modal="true" className="relative max-w-3xl max-h-[85vh]">
        <button
          onClick={onClose}
          aria-label={dict.common.close}
          className="absolute -top-10 right-0 text-white/80 hover:text-white"
        >
          <X size={24} />
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-[85vh] rounded-[16px] object-contain shadow-[var(--shadow-card)]"
        />
      </div>
    </div>,
    document.body
  );
}
