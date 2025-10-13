import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  subtitle?: string;
  trend?: "up" | "down" | "stable";
  loading?: boolean;
  variant?: "default" | "gradient" | "minimal";
}

export function StatCard({
  label,
  value,
  icon,
  change,
  changeType = "neutral",
  subtitle,
  trend,
  loading = false,
  variant = "default",
}: StatCardProps) {
  const changeColors = {
    positive: "text-emerald-400",
    negative: "text-red-400",
    neutral: "text-text-secondary",
  };

  const variants = {
    default: "bg-bg-secondary border-border hover:border-border-hover",
    gradient:
      "bg-gradient-to-br from-bg-secondary via-bg-tertiary to-bg-secondary border-border-hover",
    minimal: "bg-bg-tertiary/50 border-border",
  };

  if (loading) {
    return (
      <div
        className={`rounded-xl border p-4 sm:p-5 transition-all shadow-lg animate-fadeIn ${variants[variant]}`}
      >
        <div className="space-y-3">
          <div className="h-4 bg-bg-tertiary rounded skeleton w-24" />
          <div className="h-8 bg-bg-tertiary rounded skeleton w-32" />
          <div className="h-3 bg-bg-tertiary rounded skeleton w-20" />
        </div>
      </div>
    );
  }

  const TrendIcon = trend ? (
    <svg
      className={`w-4 h-4 ${changeColors[changeType]}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      {trend === "up" && (
        <path
          fillRule="evenodd"
          d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
          clipRule="evenodd"
        />
      )}
      {trend === "down" && (
        <path
          fillRule="evenodd"
          d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      )}
      {trend === "stable" && (
        <path
          fillRule="evenodd"
          d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
          clipRule="evenodd"
        />
      )}
    </svg>
  ) : null;

  return (
    <div
      className={`
        rounded-xl border p-4 sm:p-5 transition-all duration-300 shadow-lg
        hover:shadow-xl card-hover animate-fadeIn
        ${variants[variant]}
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider truncate">
            {label}
          </p>
          <p className="mt-2 text-2xl sm:text-3xl font-bold text-white break-words">
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs text-text-tertiary line-clamp-2">
              {subtitle}
            </p>
          )}
          {change && (
            <div className="mt-3 flex items-center gap-1.5">
              {TrendIcon}
              <p className={`text-xs sm:text-sm font-semibold ${changeColors[changeType]}`}>
                {changeType === "positive" && "+"}
                {changeType === "negative" && "-"}
                {change}
              </p>
            </div>
          )}
        </div>
        {icon && (
          <div className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-bg-elevated border border-border flex-shrink-0 hover-lift">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

// Compact stat component for inline use
export function InlineStat({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string | number;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <span className="text-xs text-text-secondary font-medium">{label}</span>
      <span className="text-base sm:text-lg font-bold text-white">{value}</span>
    </div>
  );
}

// Stat group for related metrics
export function StatGroup({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {title && (
        <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide">
          {title}
        </h3>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        {children}
      </div>
    </div>
  );
}
