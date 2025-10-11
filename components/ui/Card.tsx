import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}

export function Card({ children, className = "", title, subtitle, action }: CardProps) {
  return (
    <div className={`bg-[#141414] rounded-xl border border-[#2a2a2a] hover:border-[#3a3a3a] transition-all shadow-lg ${className}`}>
      {(title || subtitle || action) && (
        <div className="px-4 py-4 sm:px-6 sm:py-5 border-b border-[#2a2a2a] flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            {title && <h3 className="text-base sm:text-lg font-semibold text-white truncate">{title}</h3>}
            {subtitle && <p className="text-xs sm:text-sm text-[#a0a0a0] mt-1 line-clamp-2">{subtitle}</p>}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}

export function CardGrid({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 ${className}`}>
      {children}
    </div>
  );
}
