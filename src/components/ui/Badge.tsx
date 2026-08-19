import clsx from "clsx";

export type BadgeTone = "green" | "pink" | "warning" | "danger" | "neutral";

const toneClasses: Record<BadgeTone, string> = {
  green: "bg-green-200 text-green-700",
  pink: "bg-pink-100 text-pink-600",
  warning: "bg-warning-bg text-warning",
  danger: "bg-danger-bg text-danger",
  neutral: "bg-bg text-text-secondary",
};

export function Badge({
  tone,
  children,
}: {
  tone: BadgeTone;
  children: React.ReactNode;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap",
        toneClasses[tone]
      )}
    >
      {children}
    </span>
  );
}
