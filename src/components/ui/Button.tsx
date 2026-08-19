"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "accent" | "secondary" | "ghost" | "destructive";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-pink-500 text-white hover:bg-[#f37ba3]",
  accent: "bg-pink-500 text-white hover:bg-[#f37ba3]",
  secondary:
    "bg-surface text-text-primary border border-border hover:bg-bg",
  ghost: "bg-green-200 text-green-700 hover:bg-[#cee6b6]",
  destructive: "bg-danger text-white hover:bg-[#d13539]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "primary", loading = false, className, children, disabled, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(
          "inline-flex items-center justify-center gap-2 rounded-full px-5 h-11 text-sm font-semibold transition-colors",
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pink-500/40",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
