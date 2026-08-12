// SECURITY NOTE: JWT token is stored in localStorage under 'marketmaven_token'.
// In a production security pass, this should be upgraded to httpOnly cookies to mitigate XSS risks.

import { Article, TopSource, StockData, User, ReportItem, EditorsPickItem } from '../types';
import { INITIAL_ARTICLES, INITIAL_TOP_SOURCES } from '../data/mockArticles';
import { MOCK_STOCKS } from '../data/mockStocks';
import {
  InsightApiItem, ReportApiItem, EditorsPickApiItem, SourceRankApiItem, UserApiItem,
  adaptInsightList, adaptReport, adaptReportList, adaptEditorsPickList, adaptTopSourceList, adaptUser,
} from './adapters';

export const TOKEN_STORAGE_KEY = 'marketmaven_token';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Listener for 401 Unauthorized events
type UnauthorizedListener = () => void;
const unauthorizedListeners = new Set<UnauthorizedListener>();

export function onUnauthorized(listener: UnauthorizedListener): () => void {
  unauthorizedListeners.add(listener);
  return () => {
    unauthorizedListeners.delete(listener);
  };
}

function handle401() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  unauthorizedListeners.forEach((fn) => fn());
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;
  let response: Response;
  try {
    response = await fetch(url, { ...options, headers });
  } catch (err) {
    // If fetch fails due to network/offline, throw informative error
    throw new Error('Network error or connection refused. Please check your connectivity.');
  }

  if (response.status === 401) {
    handle401();
    const errorData = await response.json().catch(() => ({ message: 'Unauthorized session' }));
    throw new Error(errorData.message || 'Unauthorized: Token invalid or expired');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: `Request failed with status ${response.status}` }));
    throw new Error(errorData.message || 'An error occurred processing request');
  }

  return response.json();
}

// Ticker -> backend Issuer.id, for the watchlist endpoints (see note above
// the `watchlist` client below). Cached per page load and shared across
// calls; cleared on a lookup miss so a ticker added to the backend after
// the cache was built (e.g. a fresh ingestion run) still resolves on retry
// instead of being stuck "not found" for the rest of the session.
let issuerIdByTicker: Promise<Map<string, number>> | null = null;

function loadIssuerIdMap(): Promise<Map<string, number>> {
  return request<{ id: number; ticker: string }[]>('/issuers', { method: 'GET' }).then(
    (issuers) => new Map(issuers.map((i) => [i.ticker.toUpperCase(), i.id]))
  );
}

async function resolveIssuerId(symbolOrTicker: string): Promise<number> {
  if (!issuerIdByTicker) {
    issuerIdByTicker = loadIssuerIdMap();
  }
  let map = await issuerIdByTicker;
  let id = map.get(symbolOrTicker.toUpperCase());
  if (id === undefined) {
    // Not in the cache — refresh once in case it's genuinely new, rather
    // than failing on a stale snapshot.
    issuerIdByTicker = loadIssuerIdMap();
    map = await issuerIdByTicker;
    id = map.get(symbolOrTicker.toUpperCase());
  }
  if (id === undefined) {
    throw new Error(`"${symbolOrTicker}" isn't tracked as an issuer yet`);
  }
  return id;
}

/* ==========================================================================
   MARKETMAVEN API CLIENT SERVICE
   ========================================================================== */

export interface AuthResponse {
  access_token: string;
  user: User;
}

interface AuthApiResponse {
  access_token: string;
  user: UserApiItem;
}

export interface WatchlistApiItem {
  issuer_id: number;
  ticker: string;
  name: string;
  exchange: string;
  price?: number;
  change?: number;
  changePercent?: number;
  sparkline?: number[];
}

export interface NewsletterSignupResult {
  success: boolean;
  already_subscribed?: boolean;
  status?: string;
  message: string;
  email?: string;
}

export const apiClient = {
  // 1. AUTH ENDPOINTS
  auth: {
    // `name` isn't a real field on the backend's register payload (there's
    // no display-name column on User at all — see adaptUser) — dropped
    // before sending so it doesn't look like it's being persisted.
    register: async (payload: { email: string; password: string; name?: string }): Promise<AuthResponse> => {
      const data = await request<AuthApiResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email: payload.email, password: payload.password }),
      });
      if (data.access_token) {
        setStoredToken(data.access_token);
      }
      return { access_token: data.access_token, user: adaptUser(data.user) };
    },

    login: async (payload: { email: string; password: string }): Promise<AuthResponse> => {
      const data = await request<AuthApiResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (data.access_token) {
        setStoredToken(data.access_token);
      }
      return { access_token: data.access_token, user: adaptUser(data.user) };
    },

    me: async (): Promise<User> => {
      const data = await request<UserApiItem>('/auth/me', { method: 'GET' });
      return adaptUser(data);
    },

    verifyEmail: async (token: string): Promise<{ message: string }> => {
      return request<{ message: string }>(`/auth/verify-email?token=${encodeURIComponent(token)}`, {
        method: 'POST',
      });
    },

    forgotPassword: async (email: string): Promise<{ message: string }> => {
      return request<{ message: string }>('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    },

    resetPassword: async (token: string, new_password: string): Promise<{ message: string }> => {
      return request<{ message: string }>('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, new_password }),
      });
    },
  },

  // 2. WATCHLIST ENDPOINTS (My Portfolio)
  //
  // The rest of the app tracks watchlist entries by ticker symbol (e.g.
  // "GTCO"), but the backend's watchlist table keys on the numeric
  // Issuer.id — every call site here passes a symbol, so add/remove
  // resolve it to an issuer_id first rather than pushing that translation
  // out to every caller.
  watchlist: {
    get: async (): Promise<WatchlistApiItem[]> => {
      return request<WatchlistApiItem[]>('/watchlist', { method: 'GET' });
    },

    add: async (symbolOrTicker: string): Promise<WatchlistApiItem> => {
      const issuer_id = await resolveIssuerId(symbolOrTicker);
      return request<WatchlistApiItem>('/watchlist', {
        method: 'POST',
        body: JSON.stringify({ issuer_id }),
      });
    },

    remove: async (symbolOrTicker: string): Promise<{ message: string }> => {
      const issuer_id = await resolveIssuerId(symbolOrTicker);
      return request<{ message: string }>(`/watchlist/${encodeURIComponent(issuer_id)}`, {
        method: 'DELETE',
      });
    },
  },

  // 3. SAVED ARTICLES ENDPOINTS
  savedArticles: {
    // Same shape as InsightOut plus saved_at (no relevance_score/featured)
    // — reuses adaptInsightList rather than a separate mapper.
    get: async (): Promise<(Article & { saved_at?: string })[]> => {
      const data = await request<InsightApiItem[]>('/saved-articles', { method: 'GET' });
      return adaptInsightList(data).map((article, i) => ({ ...article, saved_at: data[i].saved_at }));
    },

    add: async (insight_id: string): Promise<{ message: string }> => {
      return request<{ message: string }>(`/saved-articles/${encodeURIComponent(insight_id)}`, {
        method: 'POST',
      });
    },

    remove: async (insight_id: string): Promise<{ message: string }> => {
      return request<{ message: string }>(`/saved-articles/${encodeURIComponent(insight_id)}`, {
        method: 'DELETE',
      });
    },
  },

  // 4. INSIGHTS & CONTENT ENDPOINTS
  insights: {
    // vertical/sort/limit are the only filters GET /insights actually
    // supports — category/search/exclude_ids/featured/featured_order were
    // being sent but silently ignored server-side (FastAPI drops unknown
    // query params rather than erroring), so those "filters" never did
    // anything. Filtering by source/keyword happens client-side in App.tsx
    // instead.
    get: async (params: {
      vertical?: string;
      sort?: 'relevance' | 'recent';
      limit?: number;
    } = {}): Promise<Article[]> => {
      const urlParams = new URLSearchParams();
      if (params.vertical) urlParams.set('vertical', params.vertical);
      if (params.sort) urlParams.set('sort', params.sort);
      if (params.limit) urlParams.set('limit', params.limit.toString());

      const queryString = urlParams.toString();
      const endpoint = `/insights${queryString ? `?${queryString}` : ''}`;
      const data = await request<InsightApiItem[]>(endpoint, { method: 'GET' });
      return adaptInsightList(data);
    },

    topSources: async (vertical?: string): Promise<TopSource[]> => {
      const endpoint = `/insights/top-sources${vertical ? `?vertical=${encodeURIComponent(vertical)}` : ''}`;
      const data = await request<SourceRankApiItem[]>(endpoint, { method: 'GET' });
      return adaptTopSourceList(data);
    },
  },

  // 5. EDITOR'S PICKS & REPORTS ENDPOINTS
  editorsPicks: {
    get: async (limit?: number): Promise<EditorsPickItem[]> => {
      const endpoint = `/editors-picks${limit ? `?limit=${limit}` : ''}`;
      const data = await request<EditorsPickApiItem[]>(endpoint, { method: 'GET' });
      return adaptEditorsPickList(data);
    },
  },

  reports: {
    get: async (params: { vertical?: string; limit?: number } = {}): Promise<ReportItem[]> => {
      const urlParams = new URLSearchParams();
      if (params.vertical) urlParams.set('vertical', params.vertical);
      if (params.limit) urlParams.set('limit', params.limit.toString());
      const query = urlParams.toString();
      const data = await request<ReportApiItem[]>(`/reports${query ? `?${query}` : ''}`, { method: 'GET' });
      return adaptReportList(data);
    },

    getBySlug: async (slug: string): Promise<ReportItem> => {
      const data = await request<ReportApiItem>(`/reports/${encodeURIComponent(slug)}`, { method: 'GET' });
      return adaptReport(data);
    },
  },

  // ADMIN REPORT AUTHORING ENDPOINTS
  admin: {
    reports: {
      getAll: async (): Promise<ReportItem[]> => {
        const data = await request<ReportApiItem[]>('/admin/reports', { method: 'GET' });
        return adaptReportList(data);
      },

      create: async (payload: {
        title: string;
        vertical: string;
        summary: string;
        body: string;
        cover_image_url?: string;
        status?: 'published' | 'draft';
        featured?: boolean;
        featured_order?: number;
      }): Promise<ReportItem> => {
        const data = await request<ReportApiItem>('/admin/reports', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        return adaptReport(data);
      },

      update: async (
        id: string,
        payload: Partial<{
          title: string;
          vertical: string;
          summary: string;
          body: string;
          cover_image_url: string;
          status: 'published' | 'draft';
          featured: boolean;
          featured_order: number;
        }>
      ): Promise<ReportItem> => {
        const data = await request<ReportApiItem>(`/admin/reports/${encodeURIComponent(id)}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
        return adaptReport(data);
      },

      delete: async (id: string): Promise<{ message: string }> => {
        return request<{ message: string }>(`/admin/reports/${encodeURIComponent(id)}`, {
          method: 'DELETE',
        });
      },
    },
  },

  // 6. NEWSLETTER
  newsletter: {
    signup: async (email: string): Promise<NewsletterSignupResult> => {
      return request<NewsletterSignupResult>('/newsletter-signup', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    },
  },

  // 6. MARKET DATA
  market: {
    benchmark: async (): Promise<any> => {
      return request<any>('/benchmark', { method: 'GET' });
    },

    peerMappings: async (): Promise<Record<string, string[]>> => {
      return request<Record<string, string[]>>('/peer-mappings', { method: 'GET' });
    },

    // Field is `id`, not `issuer_id` — matches the backend's IssuerOut
    // schema (`GET /issuers`), not the app-level IssuerItem shape.
    issuers: async (): Promise<{ id: number; ticker: string; name: string; exchange: string; sector: string | null }[]> => {
      return request<{ id: number; ticker: string; name: string; exchange: string; sector: string | null }[]>('/issuers', { method: 'GET' });
    },

    issuerPrices: async (id: string): Promise<StockData> => {
      return request<StockData>(`/issuers/${encodeURIComponent(id)}/prices`, { method: 'GET' });
    },

    index: async (code: string): Promise<any> => {
      return request<any>(`/indices/${encodeURIComponent(code)}`, { method: 'GET' });
    },
  },
};
