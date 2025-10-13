import { HTMLAttributes } from "react";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
  variant?: "text" | "circular" | "rectangular" | "rounded";
}

export function Skeleton({
  width,
  height,
  variant = "rectangular",
  className = "",
  ...props
}: SkeletonProps) {
  const variants = {
    text: "rounded h-4",
    circular: "rounded-full",
    rectangular: "rounded-none",
    rounded: "rounded-lg",
  };

  return (
    <div
      className={`skeleton ${variants[variant]} ${className}`}
      style={{
        width: width || "100%",
        height: height || (variant === "text" ? "1rem" : "auto"),
      }}
      {...props}
    />
  );
}

// Pre-built skeleton components
export function SkeletonCard() {
  return (
    <div className="bg-bg-secondary rounded-xl border border-border p-6 space-y-4 animate-fadeIn">
      <Skeleton variant="rounded" height="24px" width="60%" />
      <div className="space-y-2">
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="90%" />
        <Skeleton variant="text" width="80%" />
      </div>
      <div className="flex gap-2">
        <Skeleton variant="rounded" height="36px" width="100px" />
        <Skeleton variant="rounded" height="36px" width="100px" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3 animate-fadeIn">
      {/* Header */}
      <div className="flex gap-4 pb-3 border-b border-border">
        <Skeleton variant="text" width="20%" />
        <Skeleton variant="text" width="15%" />
        <Skeleton variant="text" width="15%" />
        <Skeleton variant="text" width="20%" />
        <Skeleton variant="text" width="15%" />
        <Skeleton variant="text" width="15%" />
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 py-3">
          <Skeleton variant="text" width="20%" />
          <Skeleton variant="text" width="15%" />
          <Skeleton variant="text" width="15%" />
          <Skeleton variant="text" width="20%" />
          <Skeleton variant="text" width="15%" />
          <Skeleton variant="text" width="15%" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-bg-secondary rounded-xl border border-border p-6 space-y-3 animate-fadeIn"
        >
          <Skeleton variant="text" width="50%" height="16px" />
          <Skeleton variant="rounded" width="70%" height="32px" />
          <Skeleton variant="text" width="40%" height="14px" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonHeader() {
  return (
    <div className="flex items-center justify-between py-4 animate-fadeIn">
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" width="40px" height="40px" />
        <div className="space-y-2">
          <Skeleton variant="text" width="150px" height="20px" />
          <Skeleton variant="text" width="100px" height="14px" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton variant="rounded" width="100px" height="40px" />
        <Skeleton variant="rounded" width="80px" height="40px" />
      </div>
    </div>
  );
}
