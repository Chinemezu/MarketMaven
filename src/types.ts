export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'Emerging Markets' | 'Markets' | 'FX & Currencies' | 'Macroeconomics' | 'Tech & Innovation';
  keywords: string[];
  source: string; // e.g., "Nairametrics", "Reuters Markets", "Bloomberg News", "Financial Times", "TechCabal", "BusinessDay"
  sourceLogo?: string;
  publishedAt: string; // ISO or relative string e.g. "14m ago"
  relativeTime: string; // e.g. "14m ago", "2h ago"
  readTime: string; // e.g. "4 min read"
  imageUrl: string;
  imageCaption?: string;
  featured: boolean;
  featuredOrder?: number; // 1 (hero lead), 2, 3 (hero right), 4, 5...
  relevanceScore: number; // 1 to 100
  isBreaking?: boolean;
  premium?: boolean; // Visual tag only, non-gated
}

export interface TickerItem {
  id: string;
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
  category: 'INDEX' | 'FX' | 'COMMODITY' | 'CRYPTO';
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  is_admin?: boolean;
}

export interface ReportItem {
  id: string;
  slug: string;
  title: string;
  vertical: string;
  summary: string;
  body?: string;
  cover_image_url?: string;
  author_name: string;
  published_date: string;
  status: 'published' | 'draft';
  featured: boolean;
  featured_order?: number;
  readTime?: string;
}

export interface EditorsPickItem {
  content_type: 'insight' | 'report';
  id: string;
  title: string;
  summary: string;
  vertical: string;
  source_or_author: string;
  url_or_slug: string;
  featured_order: number;
  published_date: string;
  imageUrl?: string;
  cover_image_url?: string;
  readTime?: string;
}

export interface TopSource {
  id: string;
  name: string;
  articleCount: number;
  domain?: string;
  category?: string;
  verified?: boolean;
  avatarBg?: string;
}

export type PageTemplateType = 'home' | 'template-a' | 'template-b' | 'template-c' | 'A' | 'B' | 'C' | 'screener' | 'converter' | 'chart' | 'advanced-charts' | 'education' | 'portfolio' | 'saved' | 'login' | 'register' | 'forgot-password' | 'reset-password' | 'reports' | 'report-detail' | 'article-detail' | 'article_detail' | 'admin-reports' | 'about' | 'terms' | 'privacy' | 'disclaimer' | 'cookies' | 'contact';

export interface IssuerItem {
  issuer_id: string;
  ticker: string;
  name: string;
  exchange: string;
  sector?: string;
  price?: number;
  change?: number;
  changePercent?: number;
}

export interface NavItem {
  id: string;
  label: string;
  path: string;
  template: PageTemplateType;
  categoryFilter?: string;
  guideId?: string;
  description?: string;
  children?: NavItem[];
}

export interface StockData {
  symbol: string;
  name: string;
  exchange: 'NGX' | 'NYSE' | 'NASDAQ' | 'LSE';
  sector: 'Technology' | 'Financial Services' | 'Energy' | 'Healthcare' | 'Consumer' | 'Industrial' | 'Telecom';
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap: string;
  peRatio: number;
  high52: number;
  low52: number;
  sparkline: number[];
  ohlc: { date: string; open: number; high: number; low: number; close: number; volume: number }[];
}

export interface WatchlistItem {
  symbol: string;
  addedAt: string;
}

export interface EducationGuide {
  id: string;
  title: string;
  category: string;
  readTime: string;
  summary: string;
  sections: {
    title: string;
    content: string;
    keyTakeaway?: string;
  }[];
  keyTerms?: { term: string; definition: string }[];
}

export interface ViewState {
  type: PageTemplateType;
  path: string;
  title: string;
  subtitle?: string;
  categoryFilter?: string;
  guideId?: string;
}


export interface NewsletterSignupRequest {
  email: string;
  sourceLocation?: string;
}

export interface NewsletterSignupResponse {
  success: boolean;
  message: string;
  status: 'subscribed' | 'already_subscribed';
  email?: string;
}
