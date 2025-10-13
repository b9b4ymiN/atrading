interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  fullScreen?: boolean;
}

export function Loading({ size = "md", text, fullScreen = false }: LoadingProps) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <svg
        className={`animate-spin ${sizes[size]} text-brand-orange`}
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
      {text && (
        <p className="text-sm text-text-secondary animate-pulse">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-bg-primary flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center py-12">{spinner}</div>;
}

export function LoadingDots() {
  return (
    <div className="flex items-center justify-center gap-1">
      <div className="w-2 h-2 bg-brand-orange rounded-full animate-pulse" />
      <div
        className="w-2 h-2 bg-brand-orange rounded-full animate-pulse"
        style={{ animationDelay: "0.2s" }}
      />
      <div
        className="w-2 h-2 bg-brand-orange rounded-full animate-pulse"
        style={{ animationDelay: "0.4s" }}
      />
    </div>
  );
}

export function LoadingBar() {
  return (
    <div className="w-full h-1 bg-bg-secondary rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-brand-orange to-brand-orange-light animate-shimmer"
        style={{ width: "30%" }}
      />
    </div>
  );
}
