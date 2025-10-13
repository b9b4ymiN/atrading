import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  variant?: 'default' | 'elevated' | 'glass';
}

export function Card({
  children,
  className = "",
  title,
  subtitle,
  action,
  variant = 'default'
}: CardProps) {
  const variants = {
    default: 'bg-bg-secondary border-border hover:border-border-hover shadow-lg',
    elevated: 'bg-bg-elevated border-border-hover hover:border-border-focus shadow-xl',
    glass: 'glass shadow-2xl',
  };

  return (
    <div
      className={`
        rounded-xl border transition-all duration-300
        card-hover animate-fadeIn
        ${variants[variant]}
        ${className}
      `}
    >
      {(title || subtitle || action) && (
        <div className="px-4 py-4 sm:px-6 sm:py-5 border-b border-border flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            {title && (
              <h3 className="text-base sm:text-lg font-semibold text-text-primary truncate">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs sm:text-sm text-text-secondary mt-1 line-clamp-2">
                {subtitle}
              </p>
            )}
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
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 ${className}`}>
      {children}
    </div>
  );
}
