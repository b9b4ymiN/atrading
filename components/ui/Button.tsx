import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "success" | "ghost" | "gradient";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  isLoading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  // Base styles with better mobile touch targets (min 44px height for iOS)
  const baseStyles = `
    font-medium rounded-lg transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary
    disabled:opacity-50 disabled:cursor-not-allowed
    active:scale-[0.98] touch-manipulation
    relative overflow-hidden
    inline-flex items-center justify-center gap-2
  `;

  const variants = {
    primary: `
      bg-brand-orange hover:bg-brand-orange-dark
      text-black font-semibold
      shadow-md hover:shadow-glow-orange
      focus:ring-brand-orange
    `,
    gradient: `
      bg-gradient-to-r from-brand-orange to-brand-orange-light
      hover:from-brand-orange-dark hover:to-brand-orange
      text-black font-semibold
      shadow-lg hover:shadow-glow-orange-lg
      focus:ring-brand-orange
    `,
    secondary: `
      bg-bg-tertiary hover:bg-bg-elevated
      text-text-primary border border-border hover:border-border-hover
      shadow-sm focus:ring-border-focus
    `,
    danger: `
      bg-red-600 hover:bg-red-700
      text-white shadow-md hover:shadow-lg
      focus:ring-red-500
    `,
    success: `
      bg-emerald-600 hover:bg-emerald-700
      text-white shadow-md hover:shadow-lg
      focus:ring-emerald-500
    `,
    ghost: `
      bg-transparent hover:bg-bg-tertiary
      text-text-primary border border-border hover:border-border-hover
      focus:ring-border-focus
    `,
  };

  // Increased padding for better mobile touch targets
  const sizes = {
    sm: "px-4 py-2 text-sm min-h-[36px]",
    md: "px-5 py-2.5 text-base min-h-[44px]",
    lg: "px-6 py-3.5 text-lg min-h-[48px] font-semibold",
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
