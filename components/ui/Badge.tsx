import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md";
}

export function Badge({ children, variant = "default", size = "md" }: BadgeProps) {
  const variants = {
    default: "bg-[#1a1a1a] text-[#a0a0a0] border border-[#2a2a2a]",
    success: "bg-emerald-900/30 text-emerald-400 border border-emerald-800/30",
    warning: "bg-yellow-900/30 text-yellow-400 border border-yellow-800/30",
    danger: "bg-red-900/30 text-red-400 border border-red-800/30",
    info: "bg-blue-900/30 text-blue-400 border border-blue-800/30",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs sm:text-sm",
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full whitespace-nowrap ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
}
