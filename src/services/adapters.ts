// Maps raw backend response shapes onto this app's display types
// (Article, ReportItem, TopSource, User, EditorsPickItem). The backend is
// an aggregator/editorial API, not a CMS — it has no full article body, no
// images, no read-time estimate, and no user display name — so several
// fields here are honest derivations from what's actually available
// (e.g. read time estimated from real summary/body text, a display name
// derived from the real email) rather than the richer, partly-fabricated
// shape the UI components were originally built against.

import { Article, ReportItem, TopSource, User, EditorsPickItem } from '../types';

export interface InsightApiItem {
  id: number;
  source: string;
  vertical: string;
  title: string;
  url: string;
  published_date: string | null;
  summary: string | null;
  relevance_score?: number;
  featured?: boolean;
  saved_at?: string;
}

export interface ReportApiItem {
  id: number;
  slug: string;
  title: string;
  author_name: string;
  vertical: string;
  summary: string;
  cover_image_url: string | null;
  status: string;
  featured: boolean;
  featured_order: number | null;
  published_at: string | null;
  body?: string;
}

export interface EditorsPickApiItem {
  content_type: 'insight' | 'report';
  id: number;
  title: string;
  summary: string | null;
  vertical: string;
  source_or_author: string;
  url_or_slug: string;
  featured_order: number | null;
  published_date: string | null;
}

export interface SourceRankApiItem {
  source: string;
  article_count: number;
}

export interface UserApiItem {
  id: number;
  email: string;
  is_verified: boolean;
  is_admin: boolean;
  name: string; // computed server-side (email prefix) as of UserOut's `name` field
}

function prettyVertical(vertical: string): string {
  return vertical
    .split('_')
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');
}

function estimateReadTime(text: string | null | undefined): string {
  const words = (text || '').trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export function formatRelativeTime(iso: string | null | undefined): string {
  if (!iso) return '';
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const diffMin = Math.round((Date.now() - then) / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.round(diffHr / 24);
  return `${diffDay}d ago`;
}

// No per-article image exists anywhere in the pipeline (feedparser
// doesn't extract one) — rather than a broken <img> or a stock photo that
// falsely implies it came from the source, this renders a plain,
// vertical-colored card as an inline SVG data URI. No network request,
// no fabricated visual.
const VERTICAL_COLORS: Record<string, string> = {
  finance: '#22C55E',
  crypto: '#F59E0B',
  forex: '#3B82F6',
  bonds: '#8B5CF6',
  etfs: '#06B6D4',
  commodities: '#EAB308',
  technology: '#6366F1',
  real_estate: '#EC4899',
  energy: '#EF4444',
  entertainment: '#F472B6',
  sports: '#10B981',
};

export function placeholderImage(vertical: string): string {
  const color = VERTICAL_COLORS[vertical] || '#5A6478';
  const label = prettyVertical(vertical);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450">` +
    `<rect width="800" height="450" fill="${color}"/>` +
    `<text x="50%" y="50%" font-family="sans-serif" font-size="36" font-weight="700" ` +
    `fill="white" fill-opacity="0.85" text-anchor="middle" dominant-baseline="middle">${label}</text>` +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function adaptInsight(raw: InsightApiItem, featuredOrder?: number): Article {
  const summary = raw.summary || raw.title;
  return {
    id: String(raw.id),
    title: raw.title,
    excerpt: summary,
    // There's no separate full-body field — `content` mirrors the summary
    // so components that render it don't break, but the real detail view
    // for an aggregated article is the external link (see `url`), not a
    // longer body we don't actually have.
    content: summary,
    url: raw.url,
    category: prettyVertical(raw.vertical),
    keywords: [],
    source: raw.source,
    publishedAt: raw.published_date || '',
    relativeTime: formatRelativeTime(raw.published_date),
    readTime: estimateReadTime(summary),
    imageUrl: placeholderImage(raw.vertical),
    featured: raw.featured ?? false,
    featuredOrder,
    relevanceScore: raw.relevance_score ?? 0,
    isBreaking: false, // no such signal exists in the aggregator
    premium: false,
  };
}

// `/insights` (and `/saved-articles`) return items already ordered
// featured-first by the backend — this numbers that real ordering (1, 2,
// 3... among just the featured ones) rather than inventing ranks, since
// a few components pick specific hero/spotlight slots by featuredOrder.
export function adaptInsightList(raw: InsightApiItem[]): Article[] {
  let featuredCounter = 0;
  return raw.map((item) => adaptInsight(item, item.featured ? ++featuredCounter : undefined));
}

export function adaptReport(raw: ReportApiItem): ReportItem {
  return {
    id: String(raw.id),
    slug: raw.slug,
    title: raw.title,
    vertical: prettyVertical(raw.vertical),
    summary: raw.summary,
    body: raw.body,
    cover_image_url: raw.cover_image_url || undefined,
    author_name: raw.author_name,
    published_date: raw.published_at || '',
    status: raw.status === 'published' ? 'published' : 'draft',
    featured: raw.featured,
    featured_order: raw.featured_order ?? undefined,
    readTime: raw.body ? estimateReadTime(raw.body) : undefined,
  };
}

export function adaptReportList(raw: ReportApiItem[]): ReportItem[] {
  return raw.map(adaptReport);
}

export function adaptEditorsPick(raw: EditorsPickApiItem): EditorsPickItem {
  return {
    content_type: raw.content_type,
    id: String(raw.id),
    title: raw.title,
    summary: raw.summary || '',
    vertical: prettyVertical(raw.vertical),
    source_or_author: raw.source_or_author,
    url_or_slug: raw.url_or_slug,
    featured_order: raw.featured_order ?? 0,
    published_date: raw.published_date || '',
  };
}

export function adaptEditorsPickList(raw: EditorsPickApiItem[]): EditorsPickItem[] {
  return raw.map(adaptEditorsPick);
}

export function adaptTopSource(raw: SourceRankApiItem): TopSource {
  return {
    id: raw.source,
    name: raw.source,
    articleCount: raw.article_count,
  };
}

export function adaptTopSourceList(raw: SourceRankApiItem[]): TopSource[] {
  return raw.map(adaptTopSource);
}

export function adaptUser(raw: UserApiItem): User {
  return {
    id: String(raw.id),
    name: raw.name,
    email: raw.email,
    createdAt: '', // not exposed by the backend and not rendered anywhere today
    is_admin: raw.is_admin,
  };
}
