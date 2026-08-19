"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";
import clsx from "clsx";
import { useLocale } from "@/lib/i18n/LocaleProvider";

interface Toast {
  id: number;
  type: "success" | "error";
  message: string;
}

interface ToastContextValue {
  showToast: (type: Toast["type"], message: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

let toastId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { dict } = useLocale();
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: Toast["type"], message: string) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={clsx(
              "flex items-center gap-2 rounded-2xl px-4 py-3 shadow-[var(--shadow-card)] bg-surface border border-border min-w-[260px]"
            )}
          >
            {toast.type === "success" ? (
              <CheckCircle2 size={20} className="text-green-700 shrink-0" strokeWidth={1.5} />
            ) : (
              <XCircle size={20} className="text-danger shrink-0" strokeWidth={1.5} />
            )}
            <p className="text-sm text-text-primary flex-1">{toast.message}</p>
            <button
              onClick={() => dismiss(toast.id)}
              className="text-text-muted hover:text-text-primary"
              aria-label={dict.common.dismiss}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}
