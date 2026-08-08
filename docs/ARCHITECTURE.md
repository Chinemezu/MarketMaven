# Component Architecture & System Design

This document provides a detailed overview of the MarketMaven frontend application architecture, state flow, layout templates, and component composition.

---

## Architecture Overview

MarketMaven utilizes a modular, single-page React architecture powered by TypeScript, Vite, and Tailwind CSS. The app features a state-driven view dispatcher that enables seamless page transitions without page reloads, while maintaining component isolation and memory efficiency.

```text
                  ┌──────────────────────────────┐
                  │          App.tsx             │
                  │   (Global Routing Hub)       │
                  └──────────────┬───────────────┘
                                 │
     ┌───────────────────────────┼───────────────────────────┐
     ▼                           ▼                           ▼
┌──────────────┐          ┌──────────────┐          ┌──────────────────┐
│ Header.tsx   │          │ Active View  │          │ Footer.tsx       │
│ - TickerStrip│          │ Dispatcher   │          │ - ValuePropStrip │
│ - Nav Menu   │          └──────┬───────┘          │ - Links & Legal  │
└──────────────┘                 │                  └──────────────────┘
                                 │
  ┌──────────────────────────────┼──────────────────────────────┐
  ▼                              ▼                              ▼
┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
│ Primary Content  │   │ Financial Tools  │   │ Member & Admin   │
│ - Home (Feed)    │   │ - Portfolio      │   │ - AuthPagesView  │
│ - Template A/B/C │   │ - Adv. Charts    │   │ - AdminReports   │
│ - ReportsList    │   │ - FX Converter   │   │ - AuthModal      │
│ - ReportDetail   │   │ - Screener       │   │ - SavedArticles  │
└──────────────────┘   └──────────────────┘   └──────────────────┘
```

---

## Navigation & View Dispatcher

The application uses an explicit state-driven router inside `App.tsx`. The navigation state is encapsulated in `activeNav`:

```typescript
export interface NavState {
  template: 
    | 'home' 
    | 'template_a' 
    | 'template_b' 
    | 'template_c' 
    | 'portfolio' 
    | 'saved' 
    | 'reports' 
    | 'report_detail' 
    | 'charts' 
    | 'currency' 
    | 'screener' 
    | 'education' 
    | 'auth_pages' 
    | 'admin_reports';
  category?: string;
  reportSlug?: string;
}
```

### View Descriptions

1. **`home`**: Primary intelligence dashboard featuring the HeroSection, EditorsPicksSection, SpotlightSection, MostRelevantSection, and MoreTopStoriesSection.
2. **`template_a` / `template_b` / `template_c`**: Specialized content layouts for specific news verticals (Equities, Fixed Income, FX & Commodities, Macro, Banking).
3. **`portfolio`**: My Portfolio / Watchlist tracking interface with stock cards, performance metrics, and watch/unwatch controls.
4. **`saved`**: User's saved articles library with filter controls and quick read options.
5. **`reports`**: Institutional research reports directory with vertical filters and featured report hero.
6. **`report_detail`**: Full-screen research report reader with article formatting, executive summaries, key takeaways, and PDF export triggers.
7. **`charts`**: Interactive candlestick/line chart workbench with timeframe selectors and technical indicators.
8. **`currency`**: FX Spot Rate Matrix & Calculator for currency pairs.
9. **`screener`**: Equity market screener with multi-factor filters.
10. **`education`**: Market Maven Academy featuring interactive financial literacy courses and glossaries.
11. **`admin_reports`**: Authoring suite for creating, editing, publishing, and managing research reports.
12. **`auth_pages`**: Dedicated standalone authentication and account recovery views.

---

## Component Hierarchy

### Global Layout Wrappers

- **`Header.tsx`**: Contains the top ticker strip, primary logo, category navigation bar, market tools dropdown menu, search trigger, theme toggle, and user membership button.
- **`TickerStrip.tsx`**: Live financial ticker bar displaying major benchmark indices, currency rates, and market indicators.
- **`Footer.tsx`**: Complete site index, compliance statements, value proposition band, and copyright notices.

### Interactive Modals

- **`AuthModal.tsx`**: Modal for Login, Registration, Forgot Password, and Email Verification.
- **`ArticleModal.tsx`**: Lightbox reader modal for full-text article consumption without navigating away from the news feed.
- **`SearchModal.tsx`**: Global full-text search overlay with auto-complete and instant filtering across insights and tickers.
- **`NewsletterModal.tsx`**: Email subscription capture for daily morning briefings.
- **`TerminalTeaseModal.tsx`**: Preview overlay showcasing upcoming institutional terminal features.

---

## State Management & API Integration

### JWT Session Handling

User authentication state is managed centrally via `apiClient.ts` and synced with `localStorage` key `marketmaven_token`.

```text
User Actions ──► apiClient ──► HTTP Request (Bearer JWT Header) ──► FastAPI Backend
                     │
              401 Unauthorized
                     │
                     ▼
           Trigger handle401()
                     │
                     ▼
  Clear Storage & Prompt Re-authentication
```

### Offline Resilience & Fallback Data

To guarantee uninterrupted UI operation, `apiClient.ts` and `api.ts` implement transparent try/catch fallback pipelines. When a network error occurs or the backend API is unreachable, the application smoothly degrades to structured mock datasets (`INITIAL_ARTICLES`, `MOCK_STOCKS`, `INITIAL_TOP_SOURCES`).

---

## Styling & Design System

- **Tailwind CSS v4**: Utility-first styling with responsive breakpoints.
- **Color Palette**: Dark slate/navy (`#0A0F1A`, `#14181F`) combined with crisp white panels, muted slate borders (`border-white/10`), and vibrant green accents (`#22C55E`).
- **Typography**: Clean serif headings paired with high-legibility sans-serif body text and monospace numeric formatting for stock prices and percentages.
