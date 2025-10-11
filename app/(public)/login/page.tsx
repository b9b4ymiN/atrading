"use client";

import { useState, useTransition } from "react";

export default function Login() {
  const [apiKey, setApiKey] = useState("");
  const [pending, start] = useTransition();
  const [error, setError] = useState("");

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
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-800 rounded-lg shadow-xl"
        style={{ padding: "32px" }}
      >
        <h1 className="text-3xl font-bold mb-2 text-center text-slate-900 dark:text-white">
          Connect API Key
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 text-center">
          Your key is stored as an HTTP-only cookie and only sent to your API.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="apiKey"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              API Key
            </label>
            <input
              id="apiKey"
              className="w-full border border-slate-300 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              placeholder="Enter your X-API-Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
            />
          </div>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          <button
            type="submit"
            style={{ marginTop: "10px" , height: "32px" }}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg px-4 py-2 transition-colors"
            disabled={pending || !apiKey}
          >
            {pending ? "Saving&" : "Save & Continue"}
          </button>
        </form>
      </div>
    </main>
  );
}
