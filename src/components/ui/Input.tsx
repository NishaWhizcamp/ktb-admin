"use client";

import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

interface FieldWrapperProps {
  label?: string;
  error?: string;
  helper?: string;
}

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "id">,
    FieldWrapperProps {
  id: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, id, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-xs font-medium text-text-secondary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={clsx(
            "h-11 rounded-xl border bg-surface px-4 text-sm text-text-primary placeholder:text-text-muted",
            "focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500",
            error ? "border-danger" : "border-border",
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs text-danger">{error}</p>
        ) : helper ? (
          <p className="text-xs text-text-muted">{helper}</p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";

interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id">,
    FieldWrapperProps {
  id: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helper, id, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-xs font-medium text-text-secondary">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={clsx(
            "rounded-xl border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted resize-none",
            "focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500",
            error ? "border-danger" : "border-border",
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs text-danger">{error}</p>
        ) : helper ? (
          <p className="text-xs text-text-muted">{helper}</p>
        ) : null}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
