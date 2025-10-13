"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
  blur?: boolean;
}

export function LoadingOverlay({
  isLoading,
  text = "Processing...",
  blur = true,
}: LoadingOverlayProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isLoading]);

  if (!mounted || !isLoading) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-300 ${
        isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/80 transition-all duration-300 ${
          blur ? "backdrop-blur-sm" : ""
        }`}
      />

      {/* Loading Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 animate-scaleIn">
        {/* Spinner Container */}
        <div className="relative">
          {/* Outer rotating ring */}
          <div className="w-20 h-20 rounded-full border-4 border-border animate-spin">
            <div className="absolute inset-0 rounded-full border-t-4 border-brand-orange shadow-glow-orange" />
          </div>

          {/* Inner pulsing circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-orange to-brand-orange-dark rounded-full animate-pulse shadow-glow-orange" />
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center space-y-2 px-6">
          <p className="text-lg font-semibold text-white animate-pulse">
            {text}
          </p>
          <div className="flex items-center justify-center gap-1">
            <div
              className="w-2 h-2 bg-brand-orange rounded-full animate-pulse"
              style={{ animationDelay: "0s" }}
            />
            <div
              className="w-2 h-2 bg-brand-orange rounded-full animate-pulse"
              style={{ animationDelay: "0.2s" }}
            />
            <div
              className="w-2 h-2 bg-brand-orange rounded-full animate-pulse"
              style={{ animationDelay: "0.4s" }}
            />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// Compact loading overlay for smaller areas
export function CompactLoadingOverlay({ isLoading }: { isLoading: boolean }) {
  if (!isLoading) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-bg-primary/80 backdrop-blur-sm rounded-lg">
      <div className="flex flex-col items-center gap-3">
        <svg
          className="animate-spin h-8 w-8 text-brand-orange"
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
      </div>
    </div>
  );
}

// Hook for managing loading state
export function useLoadingOverlay() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Processing...");

  const showLoading = (text?: string) => {
    if (text) setLoadingText(text);
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
  };

  return {
    isLoading,
    loadingText,
    showLoading,
    hideLoading,
    LoadingOverlay: () => (
      <LoadingOverlay isLoading={isLoading} text={loadingText} />
    ),
  };
}
