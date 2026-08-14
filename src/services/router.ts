// Bridges this app's existing state-switch navigation (currentNavItem /
// selectedArticle / selectedReportSlug in App.tsx) with the actual browser
// URL. The app never used real routing before — every "page" was a pure
// React state change with the address bar staying on "/" — so nothing
// could be bookmarked, shared, refreshed, or reached by a direct link
// (including the ones this app itself emails out: verification, password
// reset, admin draft-review notifications). This doesn't introduce a
// router library; App.tsx's existing NavItem-driven rendering is already
// path-aware (every handleNavigate call already carries a real `path`),
// it just never synced that path to window.location. This module is the
// two missing pieces: resolving a URL back into that same state on initial
// load / back-forward, and the static-route table handleNavigate's pushState
// needs for the reverse direction.

import { NavItem, Article } from '../types';
import { NAVIGATION_TREE } from '../data/navigation';
import { apiClient } from './apiClient';

export const HOME_NAV_ITEM: NavItem = { id: 'home', label: 'Home', path: '/', template: 'home' };

// Static routes reachable only through UI that isn't in NAVIGATION_TREE
// (account dropdown, auth flows, footer legal links) — still need an entry
// here so a direct link / refresh / back-button resolves them correctly.
// Paths must match exactly what App.tsx's handleNavigate calls already use
// for these — see the onNavigate/onNavigatePage callers in App.tsx.
const EXTRA_STATIC_ROUTES: NavItem[] = [
  { id: 'login', label: 'Log In', path: '/login', template: 'login' },
  { id: 'register', label: 'Register', path: '/register', template: 'register' },
  { id: 'forgot-password', label: 'Forgot Password', path: '/forgot-password', template: 'forgot-password' },
  { id: 'reset-password', label: 'Reset Password', path: '/reset-password', template: 'reset-password' },
  { id: 'verify-email', label: 'Verify Email', path: '/verify-email', template: 'verify-email' },
  { id: 'saved', label: 'Saved Articles', path: '/saved-articles', template: 'saved' },
  { id: 'admin-reports', label: 'Admin Reports Desk', path: '/admin/reports', template: 'admin-reports' },
  { id: 'reports', label: 'Featured Reports', path: '/reports', template: 'reports' },
  { id: 'portfolio', label: 'My Portfolio', path: '/portfolio', template: 'portfolio' },
  { id: 'about', label: 'About MarketMaven', path: '/about', template: 'about' },
  { id: 'contact', label: 'Contact MarketMaven', path: '/contact', template: 'contact' },
  { id: 'terms', label: 'Terms of Service', path: '/terms', template: 'terms' },
  { id: 'privacy', label: 'Privacy Policy', path: '/privacy', template: 'privacy' },
  { id: 'disclaimer', label: 'Market Disclaimer', path: '/disclaimer', template: 'disclaimer' },
  { id: 'cookies', label: 'Cookies & Local Storage', path: '/cookies', template: 'cookies' },
];

function flatten(items: NavItem[]): NavItem[] {
  return items.flatMap((item) => (item.children ? [item, ...flatten(item.children)] : [item]));
}

const ALL_STATIC_ROUTES = [...flatten(NAVIGATION_TREE), ...EXTRA_STATIC_ROUTES, HOME_NAV_ITEM];

export function findStaticNavItem(pathname: string): NavItem | undefined {
  return ALL_STATIC_ROUTES.find((item) => item.path === pathname);
}

export interface ResolvedRoute {
  navItem: NavItem;
  selectedArticle?: Article | null;
  selectedReportSlug?: string | null;
}

// Mirrors the exact id/label/path/template shape App.tsx's own
// handleOpenArticle / onReportClick callbacks already construct for these
// two dynamic cases, so a resolved-from-URL state is indistinguishable
// from one reached by clicking through the app normally.
export async function resolveRoute(pathname: string): Promise<ResolvedRoute> {
  const articleMatch = pathname.match(/^\/article\/([^/]+)$/);
  if (articleMatch) {
    const id = articleMatch[1];
    try {
      const article = await apiClient.insights.getById(id);
      return {
        navItem: { id: `article-${id}`, label: article.title, path: pathname, template: 'article_detail' },
        selectedArticle: article,
      };
    } catch {
      // Article no longer exists / bad id — land on home rather than a dead view.
      return { navItem: HOME_NAV_ITEM };
    }
  }

  const reportMatch = pathname.match(/^\/reports\/([^/]+)$/);
  if (reportMatch) {
    const slug = reportMatch[1];
    return {
      navItem: { id: `report-${slug}`, label: 'MarketMaven Special Report', path: pathname, template: 'report-detail' },
      selectedReportSlug: slug,
    };
  }

  const found = findStaticNavItem(pathname);
  return { navItem: found ?? HOME_NAV_ITEM };
}
