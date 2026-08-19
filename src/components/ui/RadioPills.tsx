"use client";

import clsx from "clsx";

interface Option<T extends string> {
  value: T;
  label: string;
}

interface RadioPillsProps<T extends string> {
  label?: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function RadioPills<T extends string>({
  label,
  options,
  value,
  onChange,
}: RadioPillsProps<T>) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <span className="text-xs font-medium text-text-secondary">{label}</span>
      )}
      <div className="flex flex-wrap gap-2" role="radiogroup">
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(option.value)}
              className={clsx(
                "h-11 rounded-full px-5 text-sm font-semibold transition-colors border",
                active
                  ? "bg-green-500 text-white border-green-500"
                  : "bg-surface text-text-primary border-border hover:bg-bg"
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
