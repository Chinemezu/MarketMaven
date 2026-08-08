import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { INITIAL_ARTICLES, INITIAL_TOP_SOURCES } from './src/data/mockArticles';
import { MOCK_STOCKS } from './src/data/mockStocks';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory data stores for server
interface ServerUser {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: string;
  is_admin?: boolean;
}

interface ServerReport {
  id: string;
  slug: string;
  title: string;
  vertical: string;
  summary: string;
  body: string;
  cover_image_url?: string;
  author_name: string;
  published_date: string;
  status: 'published' | 'draft';
  featured: boolean;
  featured_order: number;
  readTime?: string;
}

const usersByEmail = new Map<string, ServerUser>();
const tokensToUserId = new Map<string, string>();
const watchlistsByUserId = new Map<string, Set<string>>();
const savedArticlesByUserId = new Map<string, Set<string>>();

// Seed default user with admin privileges
const defaultUser: ServerUser = {
  id: 'usr_demo_123',
  email: 'analyst@marketmaven.com',
  password: 'password123',
  name: 'Market Maven Analyst',
  createdAt: new Date().toISOString(),
  is_admin: true,
};
usersByEmail.set(defaultUser.email, defaultUser);
const defaultToken = 'mm_token_demo_123';
tokensToUserId.set(defaultToken, defaultUser.id);
watchlistsByUserId.set(defaultUser.id, new Set(['DANGCEM', 'GTCO', 'NVDA', 'NGX-ASI']));
savedArticlesByUserId.set(defaultUser.id, new Set(['insight_1', 'insight_3']));

// Seed Initial Reports Store
const reportsStore: ServerReport[] = [
  {
    id: 'rep_sub_saharan_debt_2026',
    slug: 'sub-saharan-sovereign-debt-outlook-2026',
    title: 'Special Report: Sub-Saharan Sovereign Debt Liquidity & Yield Trajectories',
    vertical: 'Macroeconomics',
    summary: 'An empirical deep-dive into Eurobond maturities, IMF refinancing facilities, and local currency debt service metrics across West & East Africa.',
    body: `# Executive Summary

Sub-Saharan sovereign bond markets enter 2026 under a complex set of liquidity dynamics. While inflation has decelerated across key frontier markets including Nigeria, Kenya, and Ghana, high debt service burdens continue to compress fiscal headroom.

## Key Findings

1. **Refinancing Waves**: Over $7.2B in external sovereign debt matures across sub-Saharan economies between Q2 2026 and Q4 2027.
2. **Local Currency Yields**: Domestic yield curves have flattened as central bank policy rates remain restrictive to anchor foreign exchange stability.
3. **IMF & Multilateral Anchors**: Debt restructuring protocols and EFF facilities have stabilized secondary market Eurobond spreads, dropping spreads by an average of 180 bps year-on-year.

### Structural Reform & FX Liquidity

The unification of foreign exchange windows in key regional markets has significantly reduced parallel market premiums. However, structural balance-of-payments surpluses remain dependent on non-oil export diversification and domestic refining capacity.

> "Fiscal consolidation alone cannot resolve sovereign liquidity pressures without persistent structural inflows into high-yield real sector assets." — *MarketMaven Economic Research Desk*

## Regional Breakdown

- **Nigeria**: Revenue-to-debt service ratios show marked improvement following tax reform implementations, though local currency bond issuances remain heavily subscribed by institutional pension funds.
- **Kenya**: Successful liability management operations on Eurobonds have extended debt duration profiles, restoring investor confidence in benchmark paper.
- **Ghana**: Post-DDEP restructuring momentum has enabled renewed access to multilateral liquidity buffers and trade finance lines.

## Strategic Outlook

Institutional asset managers are advised to maintain a duration-neutral stance while overweighting short-duration sovereign paper backed by multilateral guarantee structures.`,
    cover_image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1200',
    author_name: 'Dr. Chidi Nwachukwu',
    published_date: '2026-07-28T09:00:00.000Z',
    status: 'published',
    featured: true,
    featured_order: 1,
    readTime: '8 min read',
  },
  {
    id: 'rep_ngx_banking_recapitalization',
    slug: 'ngx-banking-recapitalization-and-tier-1-capital-ratios',
    title: 'Deep Dive: NGX Banking Sector Recapitalization & Valuation Re-rating',
    vertical: 'Markets',
    summary: 'Analyzing capital raise exercises across Tier-1 Nigerian lenders, rights issues impact on earnings per share, and long-term ROE projections.',
    body: `# Banking Sector Special Report

The Central Bank of Nigeria's revised minimum capital thresholds have triggered one of the largest equity capital raise cycles in African financial history.

## Capital Raising Dynamics

Tier-1 commercial banks have successfully accessed international rights issues, local public offers, and private placements to fulfill new capital requirements before deadline horizons.

### Impact on Bank Fundamentals

- **Capital Adequacy Ratios (CAR)**: Average CAR across Tier-1 institutions is projected to expand to 24.5%, well above the regulatory threshold.
- **Dilution vs Growth**: Near-term EPS dilution will be counteracted by expanded balance sheet lending capacity in trade finance, infrastructure, and energy sectors.
- **Net Interest Margins (NIM)**: High policy interest rates continue to generate robust interest income, offsetting digital banking asset write-downs.

## Investment Conclusion

We maintain an **OUTPERFORM** stance on Tier-1 Nigerian lenders trading at price-to-book ratios below historical 5-year averages.`,
    cover_image_url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=1200',
    author_name: 'MarketMaven Banking Desk',
    published_date: '2026-07-25T14:30:00.000Z',
    status: 'published',
    featured: true,
    featured_order: 2,
    readTime: '6 min read',
  },
  {
    id: 'rep_fintech_and_ai_infrastructure',
    slug: 'frontier-fintech-ai-payment-rails-report-2026',
    title: 'Market Intelligence Report: AI Payment Rails & Real-Time Settlement in Frontier Tech',
    vertical: 'Tech & Innovation',
    summary: 'How generative models and automated fraud engines are optimizing cross-border remittance corridors and digital merchant acquiring in emerging markets.',
    body: `# Frontier Tech Intelligence Report: AI in Digital Payments

Cross-border remittance corridors in emerging markets are undergoing rapid structural modernization driven by AI-powered routing engines and real-time ledger verification.

## Core Drivers

1. **Automated Liquidity Routing**: AI algorithms dynamically allocate settlement balances across banking corridors to minimize slippage.
2. **Fraud Detection at Scale**: Machine learning models reduce false-positive transaction declines by 42%.
3. **Interoperable Payment Switches**: Regional instant payment switches are bridging mobile money wallets directly to merchant acquiring banks.

## Outlook for VCs and Growth Capital

Venture funding in frontier fintech is shifting heavily toward infrastructure layers rather than consumer-facing acquiring apps.`,
    cover_image_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=1200',
    author_name: 'Amina Al-Hassan',
    published_date: '2026-07-20T11:15:00.000Z',
    status: 'published',
    featured: true,
    featured_order: 3,
    readTime: '5 min read',
  }
];

// Helper slugify
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// In-memory subscribed email store
const subscribedEmails = new Set<string>([
  'subscriber@example.com',
  'investor@marketmaven.com',
  'analyst@bloomberg.net'
]);

// Helper: Auth middleware
function authenticate(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized: Missing or invalid token' });
    return;
  }
  const token = authHeader.split(' ')[1];
  const userId = tokensToUserId.get(token);
  if (!userId) {
    res.status(401).json({ message: 'Unauthorized: Session expired or token invalid' });
    return;
  }
  
  let foundUser: ServerUser | undefined;
  for (const u of usersByEmail.values()) {
    if (u.id === userId) {
      foundUser = u;
      break;
    }
  }

  if (!foundUser) {
    res.status(401).json({ message: 'Unauthorized: User no longer exists' });
    return;
  }

  (req as any).user = foundUser;
  next();
}

// Helper: Admin Auth middleware
function authenticateAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  authenticate(req, res, () => {
    const user = (req as any).user as ServerUser;
    if (!user.is_admin && !user.email.endsWith('@marketmaven.com')) {
      res.status(403).json({ message: 'Forbidden: Admin authorization required' });
      return;
    }
    next();
  });
}

// Helper sorting functions
function parseRelativeHours(publishedAt: string): number {
  const date = new Date(publishedAt);
  if (!isNaN(date.getTime())) {
    return date.getTime();
  }
  return Date.now();
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/* ==========================================================================
   1. AUTH ENDPOINTS
   ========================================================================== */

// POST /auth/register { email, password, name? } -> { access_token, user }
app.post('/auth/register', (req, res) => {
  const { email, password, name } = req.body || {};

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    res.status(400).json({ message: 'Please provide a valid email address.' });
    return;
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (usersByEmail.has(normalizedEmail)) {
    res.status(400).json({ message: 'An account with this email address already exists.' });
    return;
  }

  const newUser: ServerUser = {
    id: 'usr_' + Math.random().toString(36).substring(2, 9),
    email: normalizedEmail,
    password,
    name: name && typeof name === 'string' ? name.trim() : normalizedEmail.split('@')[0],
    createdAt: new Date().toISOString(),
  };

  usersByEmail.set(normalizedEmail, newUser);
  const token = 'mm_token_' + Math.random().toString(36).substring(2, 15);
  tokensToUserId.set(token, newUser.id);

  // Initialize empty watchlist & saved articles
  watchlistsByUserId.set(newUser.id, new Set(['DANGCEM', 'GTCO', 'NVDA']));
  savedArticlesByUserId.set(newUser.id, new Set(['insight_1']));

  const { password: _, ...userWithoutPassword } = newUser;
  res.json({
    access_token: token,
    user: userWithoutPassword,
  });
});

// POST /auth/login { email, password } -> { access_token, user }
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required.' });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = usersByEmail.get(normalizedEmail);

  if (!existingUser || existingUser.password !== password) {
    res.status(401).json({ message: 'Invalid email or password.' });
    return;
  }

  const token = 'mm_token_' + Math.random().toString(36).substring(2, 15);
  tokensToUserId.set(token, existingUser.id);

  const { password: _, ...userWithoutPassword } = existingUser;
  res.json({
    access_token: token,
    user: userWithoutPassword,
  });
});

// GET /auth/me (Bearer token) -> user
app.get('/auth/me', authenticate, (req, res) => {
  const user = (req as any).user as ServerUser;
  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// POST /auth/verify-email ?token=... -> { message }
app.post('/auth/verify-email', (req, res) => {
  const token = (req.query.token as string) || (req.body && req.body.token);
  if (!token) {
    res.status(400).json({ message: 'Verification token is required.' });
    return;
  }
  res.json({ message: 'Email successfully verified.' });
});

// POST /auth/forgot-password { email } -> { message }
app.post('/auth/forgot-password', (req, res) => {
  const { email } = req.body || {};
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    res.status(400).json({ message: 'Please enter a valid email address.' });
    return;
  }
  res.json({ message: 'If an account with that email exists, we have sent password reset instructions.' });
});

// POST /auth/reset-password { token, new_password } -> { message }
app.post('/auth/reset-password', (req, res) => {
  const { token, new_password } = req.body || {};
  if (!token) {
    res.status(400).json({ message: 'Reset token is missing or invalid.' });
    return;
  }
  if (!new_password || typeof new_password !== 'string' || new_password.length < 6) {
    res.status(400).json({ message: 'New password must be at least 6 characters long.' });
    return;
  }
  res.json({ message: 'Your password has been successfully reset. You can now log in.' });
});

/* ==========================================================================
   2. WATCHLIST ENDPOINTS (My Portfolio)
   ========================================================================== */

// GET /watchlist (Bearer token) -> [{ issuer_id, ticker, name, exchange }]
app.get('/watchlist', authenticate, (req, res) => {
  const user = (req as any).user as ServerUser;
  const userWatchlist = watchlistsByUserId.get(user.id) || new Set();

  const items = Array.from(userWatchlist).map((issuerId) => {
    const stock = MOCK_STOCKS.find(s => s.symbol.toLowerCase() === issuerId.toLowerCase());
    return {
      issuer_id: issuerId,
      ticker: stock ? stock.symbol : issuerId,
      name: stock ? stock.name : issuerId,
      exchange: stock ? stock.exchange : 'NGX',
      price: stock ? stock.price : 100,
      change: stock ? stock.change : 0,
      changePercent: stock ? stock.changePercent : 0,
      sparkline: stock ? stock.sparkline : [100, 101, 102],
    };
  });

  res.json(items);
});

// POST /watchlist { issuer_id } -> the added item
app.post('/watchlist', authenticate, (req, res) => {
  const user = (req as any).user as ServerUser;
  const { issuer_id } = req.body || {};

  if (!issuer_id) {
    res.status(400).json({ message: 'issuer_id is required.' });
    return;
  }

  let userWatchlist = watchlistsByUserId.get(user.id);
  if (!userWatchlist) {
    userWatchlist = new Set();
    watchlistsByUserId.set(user.id, userWatchlist);
  }

  userWatchlist.add(issuer_id);

  const stock = MOCK_STOCKS.find(s => s.symbol.toLowerCase() === issuer_id.toLowerCase());
  res.json({
    issuer_id,
    ticker: stock ? stock.symbol : issuer_id,
    name: stock ? stock.name : issuer_id,
    exchange: stock ? stock.exchange : 'NGX',
  });
});

// DELETE /watchlist/:issuer_id -> { message }
app.delete('/watchlist/:issuer_id', authenticate, (req, res) => {
  const user = (req as any).user as ServerUser;
  const { issuer_id } = req.params;

  const userWatchlist = watchlistsByUserId.get(user.id);
  if (userWatchlist) {
    userWatchlist.delete(issuer_id);
    for (const item of userWatchlist) {
      if (item.toLowerCase() === issuer_id.toLowerCase()) {
        userWatchlist.delete(item);
      }
    }
  }

  res.json({ message: 'Successfully removed from watchlist.' });
});

/* ==========================================================================
   3. SAVED ARTICLES ENDPOINTS
   ========================================================================== */

// GET /saved-articles -> [article objects, same shape as /insights + saved_at]
app.get('/saved-articles', authenticate, (req, res) => {
  const user = (req as any).user as ServerUser;
  const userSaved = savedArticlesByUserId.get(user.id) || new Set();

  const savedList = INITIAL_ARTICLES
    .filter(a => userSaved.has(a.id))
    .map(a => ({
      ...a,
      saved_at: new Date().toISOString(),
    }));

  res.json(savedList);
});

// POST /saved-articles/:insight_id -> { message }
app.post('/saved-articles/:insight_id', authenticate, (req, res) => {
  const user = (req as any).user as ServerUser;
  const { insight_id } = req.params;

  let userSaved = savedArticlesByUserId.get(user.id);
  if (!userSaved) {
    userSaved = new Set();
    savedArticlesByUserId.set(user.id, userSaved);
  }

  userSaved.add(insight_id);
  res.json({ message: 'Article saved successfully.' });
});

// DELETE /saved-articles/:insight_id -> { message }
app.delete('/saved-articles/:insight_id', authenticate, (req, res) => {
  const user = (req as any).user as ServerUser;
  const { insight_id } = req.params;

  const userSaved = savedArticlesByUserId.get(user.id);
  if (userSaved) {
    userSaved.delete(insight_id);
  }

  res.json({ message: 'Article removed from saved reading list.' });
});

/* ==========================================================================
   4. EDITOR'S PICKS & REPORTS ENDPOINTS
   ========================================================================== */

// GET /editors-picks?limit=N
app.get('/editors-picks', (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 6;

  // Published reports mapped to EditorsPick format
  const reportPicks = reportsStore
    .filter(r => r.status === 'published' && r.featured)
    .map(r => ({
      content_type: 'report' as const,
      id: r.id,
      title: r.title,
      summary: r.summary,
      vertical: r.vertical,
      source_or_author: r.author_name,
      url_or_slug: r.slug,
      featured_order: r.featured_order || 99,
      published_date: r.published_date,
      cover_image_url: r.cover_image_url,
      imageUrl: r.cover_image_url,
      readTime: r.readTime || '6 min read',
    }));

  // Featured insights mapped to EditorsPick format
  const insightPicks = INITIAL_ARTICLES
    .filter(a => a.featured)
    .map(a => ({
      content_type: 'insight' as const,
      id: a.id,
      title: a.title,
      summary: a.excerpt,
      vertical: a.category,
      source_or_author: a.source,
      url_or_slug: a.id,
      featured_order: a.featuredOrder || 99,
      published_date: a.publishedAt,
      imageUrl: a.imageUrl,
      readTime: a.readTime,
    }));

  // Combine both genuinely mixed
  const combined = [...reportPicks, ...insightPicks];

  // Sort by featured_order ascending
  combined.sort((a, b) => a.featured_order - b.featured_order);

  res.json(combined.slice(0, limit));
});

// GET /reports?vertical=X&limit=N -> List view (no body)
app.get('/reports', (req, res) => {
  const { vertical, limit } = req.query;

  let published = reportsStore.filter(r => r.status === 'published');

  if (vertical && typeof vertical === 'string' && vertical !== 'All') {
    const vStr = vertical.toLowerCase();
    published = published.filter(r => r.vertical.toLowerCase() === vStr);
  }

  // Omit body field for list view performance
  const list = published.map(({ body, ...rest }) => rest);

  if (limit) {
    const limNum = parseInt(limit as string, 10);
    if (!isNaN(limNum)) {
      res.json(list.slice(0, limNum));
      return;
    }
  }

  res.json(list);
});

// GET /reports/:slug -> Detail view (includes full body)
app.get('/reports/:slug', (req, res) => {
  const { slug } = req.params;
  const report = reportsStore.find(r => r.slug === slug || r.id === slug);

  if (!report || report.status !== 'published') {
    res.status(404).json({ message: 'Report not found or currently unavailable.' });
    return;
  }

  res.json(report);
});

// GET /admin/reports (Bearer token, admin only)
app.get('/admin/reports', authenticateAdmin, (req, res) => {
  res.json(reportsStore);
});

// POST /admin/reports (Bearer token, admin only)
app.post('/admin/reports', authenticateAdmin, (req, res) => {
  const { title, vertical, summary, body, cover_image_url, status, featured, featured_order } = req.body || {};

  if (!title || !vertical || !summary || !body) {
    res.status(400).json({ message: 'Title, vertical, summary, and body are required fields.' });
    return;
  }

  const newSlug = slugify(title) || 'report-' + Date.now();
  const user = (req as any).user as ServerUser;

  const newReport: ServerReport = {
    id: 'rep_' + Math.random().toString(36).substring(2, 10),
    slug: newSlug,
    title,
    vertical,
    summary,
    body,
    cover_image_url: cover_image_url || 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=1200',
    author_name: user.name || 'MarketMaven Desk',
    published_date: new Date().toISOString(),
    status: status === 'published' ? 'published' : 'draft',
    featured: Boolean(featured),
    featured_order: featured_order !== undefined ? Number(featured_order) : reportsStore.length + 1,
    readTime: `${Math.max(3, Math.ceil(body.split(' ').length / 200))} min read`,
  };

  reportsStore.unshift(newReport);
  res.status(201).json(newReport);
});

// PATCH /admin/reports/:id (Bearer token, admin only)
app.patch('/admin/reports/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const reportIndex = reportsStore.findIndex(r => r.id === id || r.slug === id);

  if (reportIndex === -1) {
    res.status(404).json({ message: 'Report not found.' });
    return;
  }

  const existing = reportsStore[reportIndex];
  const { title, vertical, summary, body, cover_image_url, status, featured, featured_order } = req.body || {};

  let updatedSlug = existing.slug;
  if (title && title !== existing.title) {
    updatedSlug = slugify(title);
  }

  const updatedReport: ServerReport = {
    ...existing,
    ...(title && { title }),
    ...(slugify(title) && { slug: updatedSlug }),
    ...(vertical && { vertical }),
    ...(summary && { summary }),
    ...(body && { body }),
    ...(cover_image_url !== undefined && { cover_image_url }),
    ...(status && { status }),
    ...(featured !== undefined && { featured: Boolean(featured) }),
    ...(featured_order !== undefined && { featured_order: Number(featured_order) }),
  };

  if (body) {
    updatedReport.readTime = `${Math.max(3, Math.ceil(body.split(' ').length / 200))} min read`;
  }

  reportsStore[reportIndex] = updatedReport;
  res.json(updatedReport);
});

// DELETE /admin/reports/:id (Bearer token, admin only)
app.delete('/admin/reports/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const index = reportsStore.findIndex(r => r.id === id || r.slug === id);

  if (index === -1) {
    res.status(404).json({ message: 'Report not found.' });
    return;
  }

  reportsStore.splice(index, 1);
  res.json({ message: 'Report deleted successfully.' });
});

/* ==========================================================================
   5. CONTENT & MARKET ENDPOINTS
   ========================================================================== */

// GET /insights?vertical=X&sort=relevance|recent&limit=N
app.get('/insights', (req, res) => {
  const {
    vertical,
    sort = 'recent',
    limit,
    featured,
    featured_order,
    category,
    search,
    exclude_ids
  } = req.query;

  let articles = [...INITIAL_ARTICLES];

  if (vertical) {
    const vStr = (vertical as string).toLowerCase();
    articles = articles.filter(a =>
      a.category.toLowerCase().includes(vStr) ||
      a.keywords.some(k => k.toLowerCase().includes(vStr)) ||
      (vStr === 'crypto' && (a.title.toLowerCase().includes('crypto') || a.title.toLowerCase().includes('bitcoin') || a.title.toLowerCase().includes('solana'))) ||
      (vStr === 'forex' && (a.title.toLowerCase().includes('fx') || a.title.toLowerCase().includes('naira') || a.title.toLowerCase().includes('dollar'))) ||
      (vStr === 'bonds' && (a.title.toLowerCase().includes('bond') || a.title.toLowerCase().includes('yield') || a.title.toLowerCase().includes('debt'))) ||
      (vStr === 'commodities' && (a.title.toLowerCase().includes('oil') || a.title.toLowerCase().includes('brent') || a.title.toLowerCase().includes('gold')))
    );

    if (articles.length === 0) {
      articles = [...INITIAL_ARTICLES];
    }
  }

  if (exclude_ids) {
    const idsToExclude = Array.isArray(exclude_ids)
      ? (exclude_ids as string[])
      : (exclude_ids as string).split(',');
    articles = articles.filter(a => !idsToExclude.includes(a.id));
  }

  if (featured !== undefined) {
    const isFeatured = featured === 'true';
    articles = articles.filter(a => a.featured === isFeatured);
  }

  if (featured_order !== undefined) {
    const orderNum = parseInt(featured_order as string, 10);
    articles = articles.filter(a => a.featuredOrder === orderNum);
  }

  if (category && category !== 'All') {
    articles = articles.filter(a =>
      a.category.toLowerCase() === (category as string).toLowerCase()
    );
  }

  if (search) {
    const q = (search as string).toLowerCase();
    articles = articles.filter(
      a =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.source.toLowerCase().includes(q) ||
        a.keywords.some(k => k.toLowerCase().includes(q))
    );
  }

  if (sort === 'relevance') {
    articles.sort((a, b) => b.relevanceScore - a.relevanceScore);
  } else {
    articles.sort((a, b) => parseRelativeHours(b.publishedAt) - parseRelativeHours(a.publishedAt));
  }

  if (limit) {
    const limitNum = parseInt(limit as string, 10);
    if (!isNaN(limitNum)) {
      articles = articles.slice(0, limitNum);
    }
  }

  res.json(articles);
});

// GET /insights/top-sources
app.get('/insights/top-sources', (req, res) => {
  res.json(INITIAL_TOP_SOURCES);
});

// POST /newsletter-signup
app.post('/newsletter-signup', (req, res) => {
  const { email } = req.body || {};

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    res.status(400).json({
      success: false,
      status: 'error',
      message: 'Please provide a valid email address.'
    });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (subscribedEmails.has(normalizedEmail)) {
    res.json({
      success: true,
      already_subscribed: true,
      status: 'already_subscribed',
      message: "You're already on the list",
      email: normalizedEmail
    });
    return;
  }

  subscribedEmails.add(normalizedEmail);

  res.json({
    success: true,
    already_subscribed: false,
    status: 'subscribed',
    message: 'Thank you for subscribing to MarketMaven Daily!',
    email: normalizedEmail
  });
});

// GET /benchmark
app.get('/benchmark', (req, res) => {
  res.json({
    indices: [
      { code: 'NGX-ASI', name: 'NGX All-Share Index', value: '102,418.90', change: '+412.30', changePercent: '+0.40%' },
      { code: 'SPX', name: 'S&P 500 Index', value: '5,548.20', change: '+24.15', changePercent: '+0.44%' },
      { code: 'IXIC', name: 'Nasdaq Composite', value: '17,872.40', change: '+118.60', changePercent: '+0.67%' },
      { code: 'BRENT', name: 'Brent Crude Oil Spot', value: '$82.40/bbl', change: '-0.85', changePercent: '-1.02%' },
    ],
    lastUpdated: new Date().toISOString()
  });
});

// GET /peer-mappings
app.get('/peer-mappings', (req, res) => {
  res.json({
    DANGCEM: ['BUACEMENT', 'WAPCO'],
    GTCO: ['ZENITHBANK', 'ACCESSCORP', 'UBA', 'FIRSTBANK'],
    NVDA: ['AMD', 'INTC', 'TSM', 'AVGO'],
    AAPL: ['MSFT', 'GOOGL', 'AMZN'],
  });
});

// GET /issuers
app.get('/issuers', (req, res) => {
  res.json(MOCK_STOCKS.map(s => ({
    issuer_id: s.symbol,
    ticker: s.symbol,
    name: s.name,
    exchange: s.exchange,
    sector: s.sector,
    price: s.price,
    change: s.change,
    changePercent: s.changePercent
  })));
});

// GET /issuers/:id/prices
app.get('/issuers/:id/prices', (req, res) => {
  const { id } = req.params;
  const stock = MOCK_STOCKS.find(s => s.symbol.toLowerCase() === id.toLowerCase());
  if (stock) {
    res.json(stock);
  } else {
    res.json({
      symbol: id.toUpperCase(),
      name: `${id.toUpperCase()} Corp`,
      exchange: 'NGX',
      sector: 'General',
      price: 150.00,
      change: +2.50,
      changePercent: +1.69,
      volume: '1.2M',
      marketCap: '₦250B',
      peRatio: 12.5,
      high52: 175.00,
      low52: 95.00,
      sparkline: [142, 145, 144, 148, 147, 149, 150],
      ohlc: [
        { date: 'Mon', open: 142, high: 145, low: 141, close: 144, volume: 1100000 },
        { date: 'Fri', open: 147, high: 152, low: 146, close: 150, volume: 1200000 },
      ]
    });
  }
});

// GET /indices/:code
app.get('/indices/:code', (req, res) => {
  const { code } = req.params;
  res.json({
    code: code.toUpperCase(),
    name: code.toUpperCase() === 'NGX-ASI' ? 'NGX All-Share Index' : `${code.toUpperCase()} Index`,
    value: '102,418.90',
    change: '+412.30',
    changePercent: '+0.40%',
    high: '103,100.00',
    low: '101,800.00',
    lastUpdated: new Date().toISOString()
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MarketMaven server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
