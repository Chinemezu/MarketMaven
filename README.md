# MarketMaven Analytics

MarketMaven is a premier financial intelligence and market analytics application. It provides real-time equity market tracking, institutional-grade research reports, interactive financial charting, currency exchange rate spot matrices, custom portfolio watchlists, and curated market news.

---

## Key Features

- **Interactive Navigation & View Templates**: Dynamic page view system supporting multi-category news verticals, research tool suites, and custom report readers.
- **My Portfolio & Watchlists**: Real-time equity tracking with custom watchlist creation, price movement indicators, and performance summaries.
- **Featured Research & Reports**: Institutional-grade research report library with deep-dive analysis, downloadable PDFs, and admin report authoring tools.
- **Market News & Insights**: Categorized intelligence feeds covering Equities, Fixed Income, FX & Commodities, Macroeconomics, and Banking.
- **Advanced Financial Charting**: Interactive canvas simulation supporting 1D to 5Y timeframes, candlestick and line chart modes, and technical indicator overlays (MA, RSI, MACD, Volume).
- **Spot FX & Currency Converter**: Real-time spot rate calculation matrix using NAFEM, CBN, and Interbank rate benchmark feeds.
- **Equity Screener**: Filter stocks by market cap, sector, P/E ratio, and price movements.
- **Authentication & User Profiles**: Complete membership flow with Registration, Login, Email Verification, Password Reset, and JWT session handling.
- **Newsletter & Alert Subscriptions**: Instant email subscription modal for daily morning briefings and breaking market alerts.

---

## Tech Stack

- **Frontend Core**: React 19, TypeScript
- **Build & Server**: Vite 6, ESBuild, Express (SSR & Static Asset Hosting), TSX
- **Styling**: Tailwind CSS v4, Lucide React icons
- **Animations**: Motion (`motion/react`)
- **HTTP & State**: Custom Fetch API Client with JWT authorization headers and offline fallback data sources

---

## Project Structure

```text
├── docs/
│   ├── ARCHITECTURE.md       # Detailed frontend component architecture & state design
│   └── API_INTEGRATION.md    # Complete FastAPI backend endpoint specifications
├── src/
│   ├── assets/               # Brand assets and imagery
│   ├── components/           # Modular React components & view templates
│   │   ├── AdminReportsView.tsx
│   │   ├── AdvancedChartsView.tsx
│   │   ├── ArticleModal.tsx
│   │   ├── AuthModal.tsx
│   │   ├── CurrencyConverterView.tsx
│   │   ├── EducationView.tsx
│   │   ├── Header.tsx
│   │   ├── PortfolioView.tsx
│   │   ├── ReportDetailView.tsx
│   │   ├── ReportsListView.tsx
│   │   ├── ScreenerView.tsx
│   │   └── ...
│   ├── data/                 # Benchmark mock data and fallback datasets
│   ├── services/             # REST API Client and data service layers
│   │   ├── api.ts
│   │   └── apiClient.ts
│   ├── App.tsx               # Main application routing and state hub
│   ├── main.tsx              # React application entry point
│   └── types.ts              # Global TypeScript interfaces and data models
├── .env.example              # Environment variable declaration guide
├── index.html                # Entry HTML file
├── package.json              # Project metadata, dependencies, and scripts
├── server.ts                 # Production & development Express server wrapper
├── tsconfig.json             # TypeScript compiler configuration
└── vite.config.ts            # Vite bundler configuration
```

---

## Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Environment Setup

Copy `.env.example` to `.env` and fill in your configuration:

```bash
cp .env.example .env
```

Available environment variables:

- `VITE_API_BASE_URL`: Base URL for the FastAPI backend microservice (e.g. `https://api.marketmaven.com`). If empty, the app gracefully falls back to cached benchmark datasets.
- `APP_URL`: Canonical domain URL for the deployed application instance.

### Installation

Install dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The app will run locally on `http://localhost:3000`.

### Production Build

To build the static bundle and compile the Express wrapper:

```bash
npm run build
```

Start the production Node server:

```bash
npm start
```

---

## Testing & Quality Assurance

Run TypeScript type checking and validation:

```bash
npm run lint
```

---

## License

All rights reserved. Proprietary software for MarketMaven Analytics.
