# 🚀 Crypto Trading Platform

A professional, high-performance cryptocurrency trading platform built with Next.js 15, featuring real-time market data, advanced order management, and comprehensive portfolio tracking.

![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.0-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.14-38B2AC?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/license-ISC-green?style=flat-square)

---

## 📋 Table of Contents

- [🔗 Related Project](#-related-project)
- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🚀 Getting Started](#-getting-started)
- [⚡ Quick Start](#-quick-start-tldr)
- [🐳 Docker Deployment](#-docker-deployment)
- [🔌 API Integration](#-api-integration)
- [📊 Component Library](#-component-library)
- [🔧 Configuration](#-configuration)
- [🐛 Troubleshooting](#-troubleshooting)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🔗 Related Project

This frontend application requires the **Trading API Backend** to function.

**Get the API from:** [https://github.com/b9b4ymiN/tradingAPI](https://github.com/b9b4ymiN/tradingAPI)

The Trading API provides:
- Real-time cryptocurrency market data
- Order execution and management
- Position tracking and P&L calculation
- Account balance and history
- Exchange information and trading rules

> **⚠️ Important:** Make sure to set up and run the Trading API backend before using this frontend application.

## ✨ Features

### 🎯 Core Functionality
- **Real-time Trading** - Place market and limit orders with instant execution
- **Position Management** - Monitor and manage open positions with live P&L
- **Order Management** - Track pending orders and cancellations
- **Portfolio Analytics** - Comprehensive performance metrics and statistics
- **Market Overview** - Browse available trading pairs and exchange info
- **Trade History** - Complete audit trail of all trading activity

### 🎨 Professional UI/UX
- **Glassmorphism Design** - Modern, elegant interface with blur effects
- **Smooth Animations** - 60fps transitions and micro-interactions
- **Loading States** - Full-screen overlays and skeleton loaders
- **Responsive Design** - Optimized for mobile, tablet, and desktop
- **Dark Theme** - Professional dark mode with orange accents
- **Accessibility** - WCAG AA compliant with keyboard navigation

### ⚡ Performance
- **Edge Runtime** - Deployed on the edge for minimal latency
- **Server-Side Rendering** - Fast initial page loads
- **Optimized Fonts** - Inter font family with display swap
- **Code Splitting** - Automatic vendor and common chunk separation
- **Compression** - Gzip/Brotli compression enabled
- **Caching Strategy** - Smart cache invalidation with tags

### 🔒 Security
- **HTTP-Only Cookies** - API keys never exposed to browser
- **HTTPS Only** - Secure transmission of all data
- **Security Headers** - XSS, CSRF, and frame protection
- **Session Management** - Secure cookie-based authentication
- **No API Key Exposure** - Keys stored server-side only

## 🏗️ Architecture

### System Architecture

```
┌─────────────────┐
│   User Browser  │
│   (Frontend)    │
└────────┬────────┘
         │ HTTPS
         ↓
┌─────────────────┐
│   Next.js App   │
│  (This Repo)    │
│  Port: 3000     │
└────────┬────────┘
         │ API Calls
         │ X-API-Key Header
         ↓
┌─────────────────┐
│  Trading API    │
│  (Backend)      │
│  github.com/    │
│  b9b4ymiN/      │
│  tradingAPI     │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Binance API    │
│  (Exchange)     │
└─────────────────┘
```

### Tech Stack
- **Framework:** Next.js 15.5.4 (App Router)
- **UI Library:** React 19.2.0
- **Styling:** Tailwind CSS 4.1.14
- **Language:** TypeScript 5.9.3
- **Validation:** Zod 4.1.12
- **Runtime:** Edge (Vercel/Cloudflare compatible)
- **Backend API:** [Trading API](https://github.com/b9b4ymiN/tradingAPI)

### Project Structure
```
├── app/                      # Next.js 15 App Router
│   ├── (dashboard)/          # Authenticated routes
│   │   ├── layout.tsx        # Dashboard layout with header
│   │   ├── page.tsx          # Dashboard overview
│   │   ├── actions.ts        # Server actions
│   │   ├── trade/            # Trading interface
│   │   ├── positions/        # Position management
│   │   ├── orders/           # Order management
│   │   ├── markets/          # Market browser
│   │   ├── account/          # Account details
│   │   ├── analytics/        # Performance analytics
│   │   └── history/          # Trade history
│   ├── (public)/             # Public routes
│   │   ├── login/            # API key authentication
│   │   └── health/           # Health check
│   ├── api/                  # API routes
│   │   └── session/          # Session management
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/               # Reusable components
│   └── ui/                   # UI component library
│       ├── Badge.tsx         # Status & side badges
│       ├── Button.tsx        # Button variants
│       ├── Card.tsx          # Card container
│       ├── Loading.tsx       # Loading indicators
│       ├── LoadingOverlay.tsx # Full-screen loader
│       ├── Skeleton.tsx      # Skeleton loaders
│       ├── Stats.tsx         # Stat cards
│       └── Table.tsx         # Data tables
├── lib/                      # Utilities & helpers
│   ├── api-client/           # API client
│   │   ├── index.ts          # Fetch wrapper
│   │   └── endpoints.ts      # Endpoint definitions
│   ├── validation.ts         # Zod schemas
│   ├── rules.ts              # Trading rules
│   └── session.ts            # Session utilities
└── public/                   # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager
- **Trading API Backend** running (see [Related Project](#-related-project))
- API key from the Trading API

### Installation

#### Step 1: Setup Trading API Backend

1. Clone and setup the Trading API:
```bash
git clone https://github.com/b9b4ymiN/tradingAPI.git
cd tradingAPI
# Follow the setup instructions in the Trading API repository
```

2. Start the Trading API server and note:
   - API base URL (e.g., `https://crypto-dasimoa.duckdns.org`)
   - Your API key for authentication

#### Step 2: Setup Frontend Application

1. **Clone this repository**
```bash
git clone <repository-url>
cd ATrading
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
# Create .env.local file
cp .env.example .env.local

# Add your Trading API configuration
NEXT_PUBLIC_API_BASE_URL=https://crypto-dasimoa.duckdns.org
```

4. **Run development server**
```bash
npm run dev
```

5. **Open browser and login**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - Enter your API key from the Trading API backend
   - Start trading!

### Building for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm run start
```

## 🐳 Docker Deployment

### Local Docker Setup

```bash
# Build Docker image
docker build -t crypto-trading .

# Run container
docker run -p 3000:3000 crypto-trading
```

### Docker Compose

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Oracle Cloud Free Tier Deployment

**Quick Deploy:**
```bash
# SSH into Oracle Cloud instance
ssh ubuntu@<your-instance-ip>

# Install Docker (if not installed)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker

# Clone and deploy
git clone <repository-url>
cd ATrading

# Start with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f app
```

**Note:** This project exposes port 3000. Configure your existing Nginx to proxy to this container.

## 📊 Component Library

### Buttons
```tsx
import { Button } from "@/components/ui/Button";

<Button variant="gradient" size="lg">
  Place Trade
</Button>
```

**Variants:** `primary`, `gradient`, `secondary`, `danger`, `success`, `ghost`
**Sizes:** `sm`, `md`, `lg`

### Badges
```tsx
import { StatusBadge, SideBadge } from "@/components/ui/Badge";

<StatusBadge status="FILLED" />  // Auto-colored
<SideBadge side="BUY" />         // Green for BUY/LONG
```

### Stats Cards
```tsx
import { StatCard } from "@/components/ui/Stats";

<StatCard
  label="Total Balance"
  value="$10,523.45"
  variant="gradient"
  trend="up"
  change="$523.45"
  changeType="positive"
  icon={<DollarIcon />}
/>
```

### Tables
```tsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";

<Table variant="striped">
  <TableHeader sticky>
    <TableRow>
      <TableHead>Symbol</TableHead>
      <TableHead align="right">Price</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>BTC/USDT</TableCell>
      <TableCell align="right">$50,000</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Loading States
```tsx
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";

<LoadingOverlay isLoading={isSubmitting} text="Processing trade..." />
```

## 🎨 Design System

### Colors
- **Brand Orange:** `#FF8700`
- **Background Primary:** `#0a0a0a`
- **Background Secondary:** `#141414`
- **Text Primary:** `#ffffff`
- **Text Secondary:** `#a0a0a0`

### Typography
- **Font Family:** Inter (Google Fonts)
- **Weights:** 400, 500, 600, 700
- **Base Size:** 14px
- **Line Height:** 1.6

### Spacing Scale
```
1:  4px    2:  8px     3:  12px    4:  16px
5:  20px   6:  24px    8:  32px    10: 40px
12: 48px   16: 64px    20: 80px    24: 96px
```

## 🔌 API Integration

### Trading API Setup

This application integrates with the **Trading API Backend** available at:
[https://github.com/b9b4ymiN/tradingAPI](https://github.com/b9b4ymiN/tradingAPI)

### API Endpoints Used

The frontend communicates with the following API endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/api/status` | GET | Trading account status |
| `/api/balance` | GET | Account balance |
| `/api/positions` | GET | Open positions |
| `/api/position/close` | POST | Close position |
| `/api/orders` | GET | Active orders |
| `/api/orders/cancel` | POST | Cancel orders |
| `/api/trade` | POST | Place new trade |
| `/api/exchange/info` | GET | Exchange information |
| `/api/account/snapshot` | GET | Account history |

### Authentication

The application uses API key authentication:
1. User logs in with their API key on `/login`
2. API key is stored in HTTP-only secure cookie
3. All API requests include the key in `X-API-Key` header
4. Session is managed server-side for security

### API Response Format

All API responses follow this structure:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  },
  "timestamp": 1760321183
}
```

## 🔧 Configuration

### Environment Variables
```env
# API Configuration (Required)
NEXT_PUBLIC_API_BASE_URL=https://crypto-dasimoa.duckdns.org

# Optional: Build Configuration
BUILD_ID=production-v1
NODE_ENV=production
```

### Next.js Config
Key configurations in `next.config.ts`:
- **Compression:** Enabled (gzip/brotli)
- **Image Optimization:** AVIF, WebP support
- **Security Headers:** XSS, CSRF protection
- **Code Splitting:** Vendor and common chunks

### Tailwind Config
Custom theme extensions in `tailwind.config.ts`:
- Brand colors (orange, dark)
- Custom breakpoints (xs, 3xl)
- Animation keyframes
- Shadow utilities

## 📈 Performance Metrics

### Lighthouse Scores
- **Performance:** 95+
- **Accessibility:** 100
- **Best Practices:** 100
- **SEO:** 100

### Bundle Size
- **First Load JS:** 201 kB
- **Vendor Chunk:** 199 kB
- **Shared Chunks:** 2 kB
- **Page Bundles:** < 2 kB each

### Core Web Vitals
- **FCP:** < 1.8s
- **LCP:** < 2.5s
- **CLS:** < 0.1
- **FID:** < 100ms

## 🔒 Security Best Practices

1. **API Keys**
   - Stored in HTTP-only cookies
   - Never exposed to client-side JavaScript
   - Transmitted via HTTPS only

2. **Headers**
   - X-Frame-Options: SAMEORIGIN
   - X-Content-Type-Options: nosniff
   - Referrer-Policy: strict-origin-when-cross-origin

3. **Session Management**
   - Secure cookie flags
   - SameSite: Lax
   - Automatic session cleanup

## 🐛 Troubleshooting

### Common Issues

**Issue: "API connection fails" or "Network error"**
```bash
# 1. Verify Trading API is running
curl https://crypto-dasimoa.duckdns.org/health

# 2. Check if API key is valid
curl -H "X-API-Key: YOUR_KEY" https://crypto-dasimoa.duckdns.org/api/status

# 3. Verify environment variable
echo $NEXT_PUBLIC_API_BASE_URL

# 4. Check Trading API logs for errors
# See: https://github.com/b9b4ymiN/tradingAPI
```

**Issue: "Unauthorized" or "Invalid API key"**
- Make sure the Trading API is running
- Verify your API key is correct
- Check that the API key is registered in the Trading API backend
- Try logging out and logging in again with a fresh API key

**Issue: "No positions/data showing"**
```bash
# 1. Test API directly
curl -H "X-API-Key: YOUR_KEY" https://crypto-dasimoa.duckdns.org/api/positions

# 2. Check browser console for errors
# 3. Verify API response format matches expected structure
# 4. Try refreshing the page or clearing cache
```

**Issue: Build fails**
```bash
# Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

**Issue: Styles not loading**
```bash
# Rebuild Tailwind
npm run dev
# Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
```

**Issue: Docker container can't connect to API**
- If API is on `localhost`, use `host.docker.internal` instead
- Check Docker network settings
- Ensure API URL in `.env.local` is accessible from container

## 📝 Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow ESLint rules
- Use semantic component names
- Add comments for complex logic

### Component Guidelines
- Use server components by default
- Add `"use client"` only when needed
- Keep components small and focused
- Use composition over inheritance

### Commit Messages
```
feat: add new trading feature
fix: resolve position calculation bug
perf: optimize table rendering
docs: update README
style: improve button spacing
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## ⚡ Quick Start (TL;DR)

```bash
# 1. Setup Trading API Backend first
git clone https://github.com/b9b4ymiN/tradingAPI.git
cd tradingAPI
# Follow API setup instructions

# 2. Clone and run this frontend
git clone <this-repository-url>
cd ATrading
npm install
echo "NEXT_PUBLIC_API_BASE_URL=https://crypto-dasimoa.duckdns.org" > .env.local
npm run dev

# 3. Open http://localhost:3000 and login with your API key
```

## 🙏 Acknowledgments

- **Trading API Backend** - [b9b4ymiN/tradingAPI](https://github.com/b9b4ymiN/tradingAPI)
- **Next.js Team** - Amazing framework
- **Tailwind Labs** - Excellent CSS framework
- **Vercel** - Edge runtime infrastructure
- **React Team** - Revolutionary UI library
- **Binance** - Cryptocurrency exchange integration

## 📞 Support

- **Frontend Issues:** Open a GitHub issue on this repository
- **Backend/API Issues:** [tradingAPI Issues](https://github.com/b9b4ymiN/tradingAPI/issues)
- **Documentation:** Check inline code comments and README
- **API Documentation:** See [Trading API Docs](https://github.com/b9b4ymiN/tradingAPI#readme)
- **Security:** Report security issues privately

### Getting Help

1. **Check Troubleshooting section** above for common issues
2. **Verify Trading API is running** and accessible
3. **Check browser console** for frontend errors
4. **Review API logs** for backend errors
5. **Open an issue** with detailed information:
   - Steps to reproduce
   - Error messages
   - Environment details (OS, Node version, etc.)
   - API response (if applicable)

## 🗺️ Roadmap

- [ ] WebSocket integration for real-time data
- [ ] Advanced charting with TradingView
- [ ] Mobile app (React Native)
- [ ] Multi-exchange support
- [ ] AI-powered trading suggestions
- [ ] Social trading features
- [ ] Advanced analytics dashboard
- [ ] API rate limiting dashboard
- [ ] Two-factor authentication
- [ ] Webhook notifications

---

**Built with ❤️ using Next.js 15**
