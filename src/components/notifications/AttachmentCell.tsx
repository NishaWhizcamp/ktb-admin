"use client";

import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import { ImagePreviewModal } from "@/components/ui/ImagePreviewModal";

export function AttachmentCell({
  imagePath,
  imageUrl,
}: {
  imagePath: string | null;
  imageUrl: string | null;
}) {
  const [previewOpen, setPreviewOpen] = useState(false);

  if (!imagePath) {
    return <span className="text-text-muted">—</span>;
  }

  const name = imagePath.split("/").pop() ?? imagePath;

  return (
    <>
      <span className="flex items-center gap-2 text-text-secondary min-w-0">
        {imageUrl ? (
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            aria-label={name}
            className="shrink-0 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-pink-500/40"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt=""
              className="h-6 w-6 rounded-[6px] object-cover shrink-0 cursor-zoom-in hover:opacity-80 transition-opacity"
            />
          </button>
        ) : (
          <ImageIcon size={16} strokeWidth={1.5} className="shrink-0" />
        )}
        <span className="truncate max-w-[140px]">{name}</span>
      </span>

      {imageUrl && (
        <ImagePreviewModal
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          src={imageUrl}
          alt={name}
        />
      )}
    </>
  );
}
