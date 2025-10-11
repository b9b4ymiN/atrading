import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  subtitle?: string;
}

export function StatCard({ label, value, icon, change, changeType = "neutral", subtitle }: StatCardProps) {
  const changeColors = {
    positive: "text-emerald-400",
    negative: "text-red-400",
    neutral: "text-[#a0a0a0]",
  };

  return (
    <div className="bg-[#141414] rounded-xl border border-[#2a2a2a] hover:border-[#3a3a3a] p-4 sm:p-5 transition-all shadow-lg hover:shadow-xl">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-[#a0a0a0] uppercase tracking-wide truncate">{label}</p>
          <p className="mt-2 text-xl sm:text-2xl font-bold text-white break-words">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-[#6a6a6a] line-clamp-2">{subtitle}</p>}
          {change && (
            <p className={`mt-2 text-xs sm:text-sm font-medium ${changeColors[changeType]}`}>
              {changeType === "positive" && "+ "}
              {changeType === "negative" && "- "}
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#1a1a1a] flex-shrink-0">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
