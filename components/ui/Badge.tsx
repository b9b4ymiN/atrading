import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "primary";
  size?: "sm" | "md" | "lg";
  className?: string;
  dot?: boolean;
  pulse?: boolean;
}

export function Badge({
  children,
  variant = "default",
  size = "md",
  className = "",
  dot = false,
  pulse = false,
}: BadgeProps) {
  const variants = {
    default: "bg-bg-tertiary text-text-secondary border-border",
    primary:
      "bg-brand-orange/20 text-brand-orange border-brand-orange/30 shadow-sm",
    success:
      "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-sm",
    warning:
      "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 shadow-sm",
    danger: "bg-red-500/20 text-red-400 border-red-500/30 shadow-sm",
    info: "bg-blue-500/20 text-blue-400 border-blue-500/30 shadow-sm",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[10px] gap-1",
    md: "px-2.5 py-1 text-xs sm:text-sm gap-1.5",
    lg: "px-3 py-1.5 text-sm sm:text-base gap-2",
  };

  const dotColors = {
    default: "bg-text-secondary",
    primary: "bg-brand-orange",
    success: "bg-emerald-400",
    warning: "bg-yellow-400",
    danger: "bg-red-400",
    info: "bg-blue-400",
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center font-medium rounded-full
        whitespace-nowrap border transition-all duration-200
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {dot && (
        <span className="relative flex h-2 w-2">
          {pulse && (
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColors[variant]}`}
            />
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${dotColors[variant]}`}
          />
        </span>
      )}
      {children}
    </span>
  );
}

// Specialized badge components
export function StatusBadge({
  status,
  size = "md",
}: {
  status: string;
  size?: "sm" | "md" | "lg";
}) {
  const statusMap: Record<
    string,
    { variant: BadgeProps["variant"]; label: string }
  > = {
    ACTIVE: { variant: "success", label: "Active" },
    FILLED: { variant: "success", label: "Filled" },
    NEW: { variant: "info", label: "New" },
    PENDING: { variant: "warning", label: "Pending" },
    PARTIALLY_FILLED: { variant: "warning", label: "Partial" },
    CANCELED: { variant: "default", label: "Canceled" },
    REJECTED: { variant: "danger", label: "Rejected" },
    EXPIRED: { variant: "danger", label: "Expired" },
  };

  const config = statusMap[status.toUpperCase()] || {
    variant: "default" as const,
    label: status,
  };

  return (
    <Badge variant={config.variant} size={size} dot pulse={config.variant === "success"}>
      {config.label}
    </Badge>
  );
}

export function SideBadge({
  side,
  size = "md",
}: {
  side: "BUY" | "SELL" | "LONG" | "SHORT" | string;
  size?: "sm" | "md" | "lg";
}) {
  const isLong = side === "BUY" || side === "LONG";
  return (
    <Badge variant={isLong ? "success" : "danger"} size={size}>
      {side}
    </Badge>
  );
}
