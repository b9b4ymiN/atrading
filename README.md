# Crypto Trading Platform

A Next.js 15 ultra-fast crypto trading web application that connects to a crypto trading API.

## Features

- **Secure Authentication**: API key stored in HTTP-only cookies (never exposed to browser)
- **Market Data**: View exchange information and trading symbols
- **Trade Placement**: Place market and limit orders with leverage (1-125x)
- **Position Management**: View and close open positions
- **Order Management**: View and cancel pending orders
- **Account Overview**: Check balance and account snapshots
- **Real-time Dashboard**: Overview of status, balance, and orders

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Runtime**: Edge-compatible
# ATrading — Trading Dashboard (Next.js + Tailwind)

Professional, responsive trading dashboard built with Next.js 15 and Tailwind CSS. This README provides a concise, practical guide to develop, build, and deploy the application, plus troubleshooting tips.

---

## Project layout (high level)

- `app/` — Next.js App Router pages, layouts and server components
- `components/` — Reusable UI components (Button, Card, Table, Stats, Badge)
- `lib/` — API client, helpers, validation and session utilities
- `public/` — Static assets
- `Dockerfile`, `.dockerignore` — Container build artifacts

---

## Quick start — Local development

Prerequisites
- Node.js 20+ (recommended)
- npm 9+ (or your preferred package manager)

Install dependencies and start dev server:

```powershell
cd "C:\Programing\Next.Js\ATrading"
npm ci
npm run dev
```

Open: http://localhost:3000 (Next.js may use another port if 3000 is occupied).

Notes
- The project uses Tailwind CSS (imported in `app/globals.css`). If you change that file, ensure `@import "tailwindcss";` remains unless you update the build pipeline.

---

## Build & production

Build the app:

```powershell
npm run build
```

Start the production server:

```powershell
npm run start
```

For production deployments prefer Docker (instructions below) or a managed platform (Vercel, Netlify, Cloudflare Pages).

---

## Docker

A multistage `Dockerfile` is included. It builds the app in a builder stage and runs it in a minimal runtime image.

Build the image:

```powershell
docker build -t atrading:latest .
```

Run the container:

```powershell
docker run -p 3000:3000 --env NODE_ENV=production --name atrading_app atrading:latest
```

Notes
- The Dockerfile uses Node 20 (alpine). Change it if you require a specific Node version.
- `.dockerignore` is included to keep images small and avoid copying local secrets.

---

## Environment variables

Place secrets in `.env.local` (this file is ignored by Git). Example variables:

```text
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
API_KEY=<your_api_key>
```

Do not commit secrets to the repository.

---

## Tailwind & Styling notes

- Tailwind v4 is wired via PostCSS (`postcss.config.mjs`). The project imports Tailwind in `app/globals.css` with `@import "tailwindcss";`.
- If utilities appear missing (for example `p-8` or `mt-2`), run the dev server and inspect the compiled CSS in DevTools. The repo includes fallback spacing rules in `app/globals.css` to mitigate some build-time issues.

---

## Troubleshooting

- `Tailwind classes not applied`: Rebuild dev server and confirm `app/globals.css` contains the Tailwind import. Check DevTools for the compiled utilities.
- `Port in use`: Next will pick another port — check console output.
- `Docker build fails`: Ensure `package-lock.json` exists or change the Dockerfile to use `npm install` instead of `npm ci`.

---

## Contributing & Code style

- Keep UI components small and focused. Reuse components from `components/ui`.
- Prefer server-side fetching for secrets and use HTTP-only cookies for API keys.
- Add tests when adding complex logic (Vitest/Jest + Testing Library recommended).

If you use the AI assistant (notes or generated content), store scratch notes locally but remember `claude.md` is intentionally excluded from Git.

---

## Next steps I can help with

- Add Docker healthcheck and run as a non-root user in the final image.
- Provide a `docker-compose.yml` for local development with mock services.
- Add CI configuration (GitHub Actions) to build and push Docker images.

---

License: ISC
