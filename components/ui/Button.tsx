import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "success" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  // Base styles with better mobile touch targets (min 44px height for iOS)
  const baseStyles = "font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 touch-manipulation";

  const variants = {
    primary: "bg-[#FF8700] hover:bg-[#e67700] text-black font-semibold shadow-sm hover:shadow-md",
    secondary: "bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white border border-[#2a2a2a] shadow-sm",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md",
    ghost: "bg-transparent hover:bg-[#1a1a1a] text-white border border-[#2a2a2a]",
  };

  // Increased padding for better mobile touch targets
  const sizes = {
    sm: "px-4 py-2 text-sm min-h-[36px]",
    md: "px-5 py-2.5 text-base min-h-[44px]",
    lg: "px-6 py-3.5 text-lg min-h-[48px]",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
