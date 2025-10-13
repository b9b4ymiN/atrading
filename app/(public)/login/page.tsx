"use client";

import { useState, useTransition } from "react";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";

export default function Login() {
  const [apiKey, setApiKey] = useState("");
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    start(async () => {
      try {
        const res = await fetch("/api/session/login", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ apiKey }),
        });
        const data = await res.json();
        if (data.success) {
          window.location.href = "/";
        } else {
          setError(data.message || "Failed to save API key");
        }
      } catch (err) {
        setError("Failed to connect to server");
      }
    });
  };

  return (
    <>
      <LoadingOverlay isLoading={pending} text="Connecting to your account..." />

      <main className="min-h-screen flex items-center justify-center bg-bg-primary p-4 sm:p-6 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-72 h-72 bg-brand-orange/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="w-full max-w-md relative z-10 animate-fadeIn">
          {/* Logo/Brand Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand-orange via-brand-orange to-brand-orange-dark rounded-2xl shadow-glow-orange mb-4">
              <span className="text-black font-bold text-3xl">₿</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 gradient-text">
              Crypto Trading
            </h1>
            <p className="text-text-secondary text-sm sm:text-base">
              Professional trading platform
            </p>
          </div>

          {/* Login Card */}
          <div className="glass rounded-2xl shadow-2xl p-6 sm:p-8 border border-border-hover">
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Connect Your Account
              </h2>
              <p className="text-sm text-text-secondary">
                Your API key is securely stored as an HTTP-only cookie and only sent to your API endpoint.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="apiKey"
                  className="block text-sm font-semibold text-text-primary mb-2"
                >
                  API Key
                </label>
                <div className="relative">
                  <input
                    id="apiKey"
                    className="w-full border border-border focus:border-brand-orange rounded-lg px-4 py-3 bg-bg-secondary text-white placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-all pr-12"
                    type={showKey ? "text" : "password"}
                    placeholder="Enter your X-API-Key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    required
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white transition-colors p-1"
                  >
                    {showKey ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="mt-2 text-xs text-text-tertiary flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Encrypted and secure
                </p>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm flex items-start gap-3 animate-scaleIn">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-brand-orange to-brand-orange-light hover:from-brand-orange-dark hover:to-brand-orange text-black font-bold rounded-lg px-6 py-3.5 transition-all duration-200 shadow-lg hover:shadow-glow-orange disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] active:scale-[0.98]"
                disabled={pending || !apiKey}
              >
                {pending ? "Connecting..." : "Continue to Dashboard"}
              </button>
            </form>

            {/* Security Notice */}
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-start gap-3 text-xs text-text-tertiary">
                <svg className="w-5 h-5 flex-shrink-0 text-brand-orange" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p>
                  Your API key is never exposed to the browser and is transmitted securely using HTTPS.
                  It is stored server-side as an HTTP-only cookie.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-6 text-center text-sm text-text-tertiary">
            <p>
              Need help?{" "}
              <a href="/health" className="text-brand-orange hover:text-brand-orange-light transition-colors">
                Check system status
              </a>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
