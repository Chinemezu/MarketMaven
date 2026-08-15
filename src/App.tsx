import React, { useState, useEffect } from 'react';
import { Article, NavItem, StockData, TopSource, User } from './types';
import { fetchInsights, fetchTopSources } from './services/api';
import { apiClient, getStoredToken, clearStoredToken, onUnauthorized } from './services/apiClient';
import { resolveRoute } from './services/router';
import { sectionFeedParams } from './data/sectionFeeds';
import { MOCK_STOCKS } from './data/mockStocks';

// Header and Shell
import { TickerStrip } from './components/TickerStrip';
import { Header } from './components/Header';
import { ValuePropStrip } from './components/ValuePropStrip';
import { NewsletterCtaBand } from './components/NewsletterCtaBand';
import { Footer } from './components/Footer';

// Homepage Subsections
import { HeroSection } from './components/HeroSection';
import { SpotlightSection } from './components/SpotlightSection';
import { SpotlightPickSection } from './components/SpotlightPickSection';
import { MostRelevantSection } from './components/MostRelevantSection';
import { EditorsPicksSection } from './components/EditorsPicksSection';
import { MoreTopStoriesSection } from './components/MoreTopStoriesSection';

// Page Views & Templates
import { TemplateAPage } from './components/TemplateAPage';
import { TemplateBPage } from './components/TemplateBPage';
import { TemplateCPage } from './components/TemplateCPage';
import { ScreenerView } from './components/ScreenerView';
import { CurrencyConverterView } from './components/CurrencyConverterView';
import { EconomicIndicatorsView } from './components/EconomicIndicatorsView';
import { AdvancedChartsView } from './components/AdvancedChartsView';
import { EducationView } from './components/EducationView';
import { PortfolioView } from './components/PortfolioView';
import { SavedArticlesView } from './components/SavedArticlesView';
import { AuthPagesView } from './components/AuthPagesView';
import { ReportsListView } from './components/ReportsListView';
import { ReportDetailView } from './components/ReportDetailView';
import { AdminReportsView } from './components/AdminReportsView';
import { InfoPagesView } from './components/InfoPagesView';
import { ArticleDetailView } from './components/ArticleDetailView';

// Modals
import { ArticleModal } from './components/ArticleModal';
import { SearchModal } from './components/SearchModal';
import { NewsletterModal } from './components/NewsletterModal';
import { TerminalTeaseModal } from './components/TerminalTeaseModal';
import { AuthModal } from './components/AuthModal';

import { Filter, RefreshCw, X, ChevronRight } from 'lucide-react';

export default function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [topSources, setTopSources] = useState<TopSource[]>([]);
  const [loading, setLoading] = useState(true);

  // Real, correctly-filtered data for a Market News section (Latest/Stock
  // Market/Currencies/Crypto) — see data/sectionFeeds.ts. Previously these
  // sections client-side-filtered the single globally-loaded `articles`
  // list by fuzzy-matching the nav label against category strings, which
  // didn't actually filter by vertical at all.
  const [sectionArticles, setSectionArticles] = useState<Article[]>([]);
  const [sectionLoading, setSectionLoading] = useState(false);

  // Active navigation location state
  const [currentNavItem, setCurrentNavItem] = useState<NavItem>({
    id: 'home',
    label: 'Home',
    path: '/',
    template: 'home',
  });

  // Account & Persistence States
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('mm_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [watchlist, setWatchlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('mm_watchlist');
    return saved ? JSON.parse(saved) : [];
  });
  // Surfaced in PortfolioView as an inline banner -- see handleToggleWatchlist's
  // catch block. Previously the failure was only console.error'd and silently
  // rolled back, so a phantom/unrecognized ticker's Follow button just did
  // nothing visible.
  const [watchlistError, setWatchlistError] = useState<string | null>(null);

  const [savedArticleIds, setSavedArticleIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('mm_saved_articles');
    return saved ? JSON.parse(saved) : ['insight_1', 'insight_3'];
  });

  // Active filter states for homepage view
  const [activeSourceFilter, setActiveSourceFilter] = useState<string | null>(null);
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);

  // Modal states
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [subscribeModalOpen, setSubscribeModalOpen] = useState(false);
  const [terminalModalOpen, setTerminalModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [authPromptMessage, setAuthPromptMessage] = useState<string | undefined>(undefined);

  // Chart selection state for jumping from screener/portfolio to technical charts
  const [selectedStockForChart, setSelectedStockForChart] = useState<StockData | undefined>(undefined);

  // Selected report slug for detail view
  const [selectedReportSlug, setSelectedReportSlug] = useState<string | null>(null);

  // Listen for 401 Unauthorized events from apiClient
  useEffect(() => {
    const unsubscribe = onUnauthorized(() => {
      setCurrentUser(null);
      localStorage.removeItem('mm_user');
      handleNavigate({
        id: 'login',
        label: 'Log In',
        path: '/login',
        template: 'login',
      });
    });
    return unsubscribe;
  }, []);

  // Sync user & token on startup
  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      apiClient.auth.me()
        .then((user) => {
          setCurrentUser(user);
          localStorage.setItem('mm_user', JSON.stringify(user));
          // Fetch backend watchlist and saved articles
          Promise.all([
            apiClient.watchlist.get().catch(() => null),
            apiClient.savedArticles.get().catch(() => null),
          ]).then(([watchlistItems, savedList]) => {
            if (watchlistItems && Array.isArray(watchlistItems)) {
              // watchlist state is tracked by ticker symbol everywhere in
              // this app (MOCK_STOCKS lookups, includes() checks) — issuer_id
              // is a numeric FK the backend needs, not what the UI compares
              // against, and being always-truthy it silently won over
              // .ticker here.
              setWatchlist(watchlistItems.map((item) => item.ticker));
            }
            if (savedList && Array.isArray(savedList)) {
              setSavedArticleIds(savedList.map((item) => item.id));
            }
          });
        })
        .catch(() => {
          clearStoredToken();
          setCurrentUser(null);
        });
    }
  }, []);

  // Sync states to local storage for quick offline availability
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('mm_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('mm_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('mm_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('mm_saved_articles', JSON.stringify(savedArticleIds));
  }, [savedArticleIds]);

  // Load initial dataset
  const loadData = async () => {
    setLoading(true);
    try {
      const [allArticles, sources] = await Promise.all([
        fetchInsights({ sort: 'relevance' }),
        fetchTopSources(),
      ]);
      setArticles(allArticles);
      setTopSources(sources);
    } catch (err) {
      console.error('Failed to load insights data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Fetch the real, correctly-filtered feed whenever a Market News section
  // is the active view — see data/sectionFeeds.ts for the vertical/sort
  // mapping per section.
  useEffect(() => {
    const params = sectionFeedParams(currentNavItem.id);
    if (!params) return;
    let isMounted = true;
    setSectionLoading(true);
    apiClient.insights.get(params)
      .then((data) => { if (isMounted) setSectionArticles(data); })
      .catch((err) => {
        console.warn('Failed to load section feed:', err);
        if (isMounted) setSectionArticles([]);
      })
      .finally(() => { if (isMounted) setSectionLoading(false); });
    return () => { isMounted = false; };
  }, [currentNavItem.id]);

  // Handlers for navigation & state
  //
  // This is the single choke point essentially every navigation in the app
  // already goes through (nav clicks, article/report opens, footer links).
  // Syncing the real URL here — rather than in each of those call sites —
  // is what makes every one of them bookmarkable/shareable/refreshable in
  // one place. `skipPush` exists for the popstate handler below: when the
  // back/forward button already changed the URL, re-pushing here would
  // break the browser history stack instead of following it.
  const handleNavigate = (item: NavItem, options?: { skipPush?: boolean }) => {
    if ((item.id === 'portfolio' || item.path === '/portfolio') && !currentUser) {
      handleNavigate({ id: 'login', label: 'Log In', path: '/login', template: 'login' });
      return;
    }
    setCurrentNavItem(item);
    setActiveSourceFilter(null);
    setActiveTagFilter(null);
    if (!options?.skipPush && window.location.pathname !== item.path) {
      window.history.pushState(null, '', item.path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Resolve the real URL into app state on first load (deep link / direct
  // visit / refresh) and on browser back-forward navigation. Both paths
  // share resolveRoute() so a URL always resolves to the same state
  // whether the app is booting into it or navigating back to it.
  useEffect(() => {
    const pathname = window.location.pathname;
    if (pathname === '/' || pathname === '') return; // already the default state
    resolveRoute(pathname).then(({ navItem, selectedArticle: art, selectedReportSlug: slug }) => {
      if (art) setSelectedArticle(art);
      if (slug) setSelectedReportSlug(slug);
      handleNavigate(navItem, { skipPush: true });
    });
  }, []);

  useEffect(() => {
    const onPopState = () => {
      resolveRoute(window.location.pathname).then(({ navItem, selectedArticle: art, selectedReportSlug: slug }) => {
        setSelectedArticle(art ?? null);
        setSelectedReportSlug(slug ?? null);
        handleNavigate(navItem, { skipPush: true });
      });
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const handleToggleWatchlist = async (symbol: string) => {
    if (!currentUser) {
      setAuthPromptMessage('Log in to track custom tickers in your personal portfolio watchlist.');
      setAuthModalMode('login');
      setAuthModalOpen(true);
      return;
    }

    const isCurrentlyAdded = watchlist.includes(symbol);
    // Optimistic UI update
    setWatchlist((prev) =>
      isCurrentlyAdded ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
    setWatchlistError(null);

    try {
      if (isCurrentlyAdded) {
        await apiClient.watchlist.remove(symbol);
      } else {
        await apiClient.watchlist.add(symbol);
      }
    } catch (err) {
      console.error('Watchlist API update error:', err);
      // Rollback on error
      setWatchlist((prev) =>
        isCurrentlyAdded ? [...prev, symbol] : prev.filter((s) => s !== symbol)
      );
      setWatchlistError(err instanceof Error ? err.message : 'Failed to update watchlist.');
    }
  };

  const handleToggleSaveArticle = async (articleId: string) => {
    if (!currentUser) {
      setAuthPromptMessage('Sign in to save articles to your personal reading list.');
      setAuthModalMode('login');
      setAuthModalOpen(true);
      return;
    }

    const isCurrentlySaved = savedArticleIds.includes(articleId);
    // Optimistic UI update
    setSavedArticleIds((prev) =>
      isCurrentlySaved ? prev.filter((id) => id !== articleId) : [...prev, articleId]
    );

    try {
      if (isCurrentlySaved) {
        await apiClient.savedArticles.remove(articleId);
      } else {
        await apiClient.savedArticles.add(articleId);
      }
    } catch (err) {
      console.error('Saved article API update error:', err);
      // Rollback on error
      setSavedArticleIds((prev) =>
        isCurrentlySaved ? [...prev, articleId] : prev.filter((id) => id !== articleId)
      );
    }
  };

  const handleOpenAuthPrompt = (mode: 'login' | 'signup' = 'login', message?: string) => {
    setAuthModalMode(mode);
    setAuthPromptMessage(message);
    setAuthModalOpen(true);
  };

  const handleLogout = () => {
    clearStoredToken();
    setCurrentUser(null);
    handleNavigate({
      id: 'home',
      label: 'Home',
      path: '/',
      template: 'home',
    });
  };

  const handleSelectStockChart = (stock: StockData) => {
    setSelectedStockForChart(stock);
    handleNavigate({
      id: 'advanced-charts',
      label: 'Advanced Charts',
      path: '/research/advanced-charts',
      template: 'advanced-charts',
    });
  };

  const handleOpenArticle = (art: Article) => {
    setSelectedArticle(art);
    handleNavigate({
      id: `article-${art.id}`,
      label: art.title,
      path: `/article/${art.id}`,
      template: 'article_detail',
    });
  };

  // Filtered articles for home view
  const filteredArticles = articles.filter((art) => {
    if (activeSourceFilter && art.source.toLowerCase() !== activeSourceFilter.toLowerCase()) {
      return false;
    }
    if (activeTagFilter && !art.keywords.some((k) => k.toLowerCase() === activeTagFilter.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Calculate homepage article subsets
  const leadHeroStory = filteredArticles.find((a) => a.featured && a.featuredOrder === 1) || filteredArticles[0];

  const recentHeadlines = [...filteredArticles]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 6);

  const heroSecondary = filteredArticles.filter(
    (a) => a.featured && (a.featuredOrder === 2 || a.featuredOrder === 3)
  );

  const heroUsedIds = new Set<string>([
    leadHeroStory?.id,
    ...heroSecondary.map((a) => a.id),
  ].filter(Boolean) as string[]);

  const spotlightPool = filteredArticles.filter((a) => !heroUsedIds.has(a.id));
  const spotlightMain = spotlightPool[0];
  const spotlightSub = spotlightPool.slice(1, 4);

  const spotlightUsedIds = new Set<string>([
    ...Array.from(heroUsedIds),
    spotlightMain?.id,
    ...spotlightSub.map((a) => a.id),
  ].filter(Boolean) as string[]);

  const mostRelevantPool = [...filteredArticles]
    .filter((a) => !spotlightUsedIds.has(a.id))
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 5);

  const mostRelevantUsedIds = new Set<string>([
    ...Array.from(spotlightUsedIds),
    ...mostRelevantPool.map((a) => a.id),
  ]);

  const editorsPicksList = filteredArticles
    .filter((a) => !mostRelevantUsedIds.has(a.id) && a.featured)
    .concat(filteredArticles.filter((a) => !mostRelevantUsedIds.has(a.id) && !a.featured))
    .slice(0, 4);

  const editorsPicksUsedIds = new Set<string>([
    ...Array.from(mostRelevantUsedIds),
    ...editorsPicksList.map((a) => a.id),
  ]);

  const moreTopStories = filteredArticles
    .filter((a) => !editorsPicksUsedIds.has(a.id))
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 8);

  const sidebarMostRelevantRanking = [...articles]
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 5);

  // Helper to render current active view template
  const renderCurrentView = () => {
    switch (currentNavItem.template) {
      case 'home':
        return (
          <>
            <HeroSection
              leadStory={leadHeroStory}
              recentHeadlines={recentHeadlines}
              featuredSecondary={heroSecondary}
              onArticleClick={handleOpenArticle}
            />
            <SpotlightPickSection
              onArticleClick={handleOpenArticle}
              onReportClick={(slug) => {
                setSelectedReportSlug(slug);
                handleNavigate({
                  id: `report-${slug}`,
                  label: 'MarketMaven Special Report',
                  path: `/reports/${slug}`,
                  template: 'report-detail',
                });
              }}
            />
            <SpotlightSection
              mainStory={spotlightMain}
              subStories={spotlightSub}
              onArticleClick={handleOpenArticle}
            />
            <MostRelevantSection
              articles={mostRelevantPool}
              onArticleClick={handleOpenArticle}
            />
            <EditorsPicksSection
              mostRelevantRanking={sidebarMostRelevantRanking}
              topSources={topSources}
              onArticleClick={handleOpenArticle}
              onReportClick={(slug) => {
                setSelectedReportSlug(slug);
                handleNavigate({
                  id: `report-${slug}`,
                  label: 'MarketMaven Special Report',
                  path: `/reports/${slug}`,
                  template: 'report-detail',
                });
              }}
              onSourceSelect={(src) => setActiveSourceFilter(src)}
            />
            <MoreTopStoriesSection
              articles={moreTopStories}
              onArticleClick={handleOpenArticle}
            />
            <NewsletterCtaBand />
          </>
        );

      case 'login':
      case 'register':
      case 'forgot-password':
      case 'reset-password':
      case 'verify-email':
        return (
          <AuthPagesView
            mode={currentNavItem.template}
            promptMessage={authPromptMessage}
            onNavigate={(path, mode) => {
              handleNavigate({ id: mode, label: mode.replace('-', ' ').toUpperCase(), path, template: mode });
            }}
            onAuthSuccess={(user) => {
              setCurrentUser(user);
              // Fetch watchlist & saved articles for new user
              Promise.all([
                apiClient.watchlist.get().catch(() => null),
                apiClient.savedArticles.get().catch(() => null),
              ]).then(([watchlistItems, savedList]) => {
                if (watchlistItems && Array.isArray(watchlistItems)) {
                  // watchlist state is tracked by ticker symbol everywhere in
                  // this app (MOCK_STOCKS lookups, includes() checks) — issuer_id
                  // is a numeric FK the backend needs, not what the UI compares
                  // against, and being always-truthy it silently won over
                  // .ticker here.
                  setWatchlist(watchlistItems.map((item) => item.ticker));
                }
                if (savedList && Array.isArray(savedList)) {
                  setSavedArticleIds(savedList.map((item) => item.id));
                }
              });

              handleNavigate({
                id: 'portfolio',
                label: 'My Portfolio',
                path: '/portfolio',
                template: 'portfolio',
              });
            }}
          />
        );

      case 'A':
      case 'template-a': {
        // Real vertical-filtered feed for any section with a mapping in
        // sectionFeedParams (Latest/Stock Market/Crypto today) — falls
        // back to a plain slice of the global feed only for a
        // hypothetical 'A'-templated nav item with no section mapping,
        // which doesn't currently exist but shouldn't render blank if
        // one's added later without also adding a feed mapping.
        const hasSectionFeed = !!sectionFeedParams(currentNavItem.id);
        const feedArticles = hasSectionFeed ? sectionArticles : articles.slice(0, 9);
        return (
          <TemplateAPage
            title={currentNavItem.label}
            subtitle={currentNavItem.description}
            articles={feedArticles}
            loading={hasSectionFeed && sectionLoading}
            currentUser={currentUser}
            savedArticleIds={savedArticleIds}
            onToggleSaveArticle={handleToggleSaveArticle}
            onArticleClick={handleOpenArticle}
            onOpenAuthPrompt={() => handleOpenAuthPrompt('login', 'Sign in to save stories')}
          />
        );
      }

      case 'B':
      case 'template-b': {
        const isRates = currentNavItem.id.includes('rates');
        return (
          <TemplateBPage
            title={currentNavItem.label}
            subtitle={currentNavItem.description}
            type={isRates ? 'rates' : 'currencies'}
            // Real forex news below the rates widget -- only for the
            // actual Currencies section (sectionFeedParams has no entry
            // for a hypothetical 'rates' page, so newsArticles stays
            // undefined there and the news block doesn't render at all).
            newsArticles={sectionFeedParams(currentNavItem.id) ? sectionArticles : undefined}
            newsLoading={sectionLoading}
            currentUser={currentUser}
            savedArticleIds={savedArticleIds}
            onToggleSaveArticle={handleToggleSaveArticle}
            onArticleClick={handleOpenArticle}
            onOpenAuthPrompt={() => handleOpenAuthPrompt('login', 'Sign in to save stories')}
          />
        );
      }

      case 'C':
      case 'template-c':
        return (
          <TemplateCPage
            title={currentNavItem.label}
            description={currentNavItem.description}
            categoryName={currentNavItem.label}
          />
        );

      case 'portfolio':
        return (
          <PortfolioView
            currentUser={currentUser}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
            onOpenAuthPrompt={() => handleOpenAuthPrompt('login', 'Sign in to manage portfolio watchlists')}
            onSelectStockChart={handleSelectStockChart}
            watchlistError={watchlistError}
            onDismissWatchlistError={() => setWatchlistError(null)}
          />
        );

      case 'saved':
        return (
          <SavedArticlesView
            currentUser={currentUser}
            savedArticleIds={savedArticleIds}
            articles={articles}
            onToggleSaveArticle={handleToggleSaveArticle}
            onArticleClick={handleOpenArticle}
            onOpenAuthPrompt={() => handleOpenAuthPrompt('login', 'Sign in to view saved reading list')}
          />
        );

      case 'screener':
        return (
          <ScreenerView
            currentUser={currentUser}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
            onOpenAuthPrompt={() => handleOpenAuthPrompt('login', 'Sign in to save tickers')}
            onSelectStockChart={handleSelectStockChart}
          />
        );

      case 'converter':
        return <CurrencyConverterView />;

      case 'economic-indicators':
        return <EconomicIndicatorsView />;

      case 'advanced-charts':
        return <AdvancedChartsView initialStock={selectedStockForChart} />;

      case 'education':
        return (
          <EducationView
            guideId={currentNavItem.id}
            onSelectGuide={(guideId) =>
              setCurrentNavItem({
                id: guideId,
                label: 'MarketMaven Education',
                path: `/education/${guideId}`,
                template: 'education',
              })
            }
          />
        );

      case 'reports':
      case 'newsletters':
        return (
          <ReportsListView
            newsletterOnly={currentNavItem.template === 'newsletters'}
            onSelectReport={(slug) => {
              setSelectedReportSlug(slug);
              handleNavigate({
                id: `report-${slug}`,
                label: 'MarketMaven Special Report',
                path: `/reports/${slug}`,
                template: 'report-detail',
              });
            }}
          />
        );

      case 'report-detail':
        return (
          <ReportDetailView
            slug={selectedReportSlug || 'sub-saharan-sovereign-debt-outlook-2026'}
            onBack={() => {
              handleNavigate({
                id: 'reports',
                label: 'Featured Reports',
                path: '/reports',
                template: 'reports',
              });
            }}
          />
        );

      case 'admin-reports':
        return (
          <AdminReportsView
            user={currentUser}
            onNavigateHome={() =>
              handleNavigate({
                id: 'home',
                label: 'Home',
                path: '/',
                template: 'home',
              })
            }
            onViewReport={(slug) => {
              setSelectedReportSlug(slug);
              handleNavigate({
                id: `report-${slug}`,
                label: 'MarketMaven Special Report',
                path: `/reports/${slug}`,
                template: 'report-detail',
              });
            }}
          />
        );

      case 'about':
      case 'terms':
      case 'privacy':
      case 'disclaimer':
      case 'cookies':
      case 'contact':
        return (
          <InfoPagesView
            page={currentNavItem.template}
            onNavigate={(template, label) =>
              handleNavigate({
                id: template,
                label,
                path: `/${template}`,
                template,
              })
            }
          />
        );

      case 'article_detail':
      case 'article-detail':
        const currentArticle = selectedArticle || articles[0];
        return (
          <ArticleDetailView
            article={currentArticle}
            currentUser={currentUser}
            savedArticleIds={savedArticleIds}
            allArticles={articles}
            onBack={() => {
              handleNavigate({
                id: 'home',
                label: 'Home',
                path: '/',
                template: 'home',
              });
            }}
            onSelectArticle={handleOpenArticle}
            onSelectTag={(tag) => {
              setActiveTagFilter(tag);
              handleNavigate({
                id: 'home',
                label: 'Home',
                path: '/',
                template: 'home',
              });
            }}
            onToggleSaveArticle={handleToggleSaveArticle}
            onOpenAuthPrompt={() => handleOpenAuthPrompt('login', 'Sign in to save stories')}
          />
        );

      default:
        return (
          <TemplateAPage
            title={currentNavItem.label}
            articles={articles.slice(0, 9)}
            currentUser={currentUser}
            savedArticleIds={savedArticleIds}
            onToggleSaveArticle={handleToggleSaveArticle}
            onArticleClick={handleOpenArticle}
            onOpenAuthPrompt={() => handleOpenAuthPrompt('login')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFBFC] text-[#14181F] flex flex-col font-sans selection:bg-[#22C55E] selection:text-white">
      {/* 1. Ticker Strip */}
      <TickerStrip onItemClick={() => setSearchModalOpen(true)} />

      {/* 2. Editorial Header */}
      <Header
        currentPath={currentNavItem.path}
        currentUser={currentUser}
        savedArticlesCount={savedArticleIds.length}
        onNavigate={handleNavigate}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenSubscribe={() => setSubscribeModalOpen(true)}
        onOpenAuth={(mode) => {
          if (mode === 'login' || mode === 'signup') {
            handleNavigate({
              id: mode === 'signup' ? 'register' : 'login',
              label: mode === 'signup' ? 'Register' : 'Log In',
              path: mode === 'signup' ? '/register' : '/login',
              template: mode === 'signup' ? 'register' : 'login',
            });
          } else {
            handleOpenAuthPrompt(mode);
          }
        }}
        onLogout={handleLogout}
      />

      {/* 3. Value-Prop Strip (only on home) */}
      {currentNavItem.template === 'home' && (
        <ValuePropStrip
          onOpenSubscribe={() => setSubscribeModalOpen(true)}
          onOpenTerminalTease={() => setTerminalModalOpen(true)}
        />
      )}

      {/* Breadcrumb Trail for non-home pages */}
      {currentNavItem.template !== 'home' && (
        <div className="bg-[#0A0F1A] border-b border-white/10 text-white text-xs py-2.5 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex items-center gap-2 font-mono">
            <button
              onClick={() =>
                handleNavigate({
                  id: 'home',
                  label: 'Home',
                  path: '/',
                  template: 'home',
                })
              }
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              MarketMaven Home
            </button>
            <ChevronRight className="w-3 h-3 text-slate-500" />
            <span className="text-[#22C55E] font-bold truncate">{currentNavItem.label}</span>
          </div>
        </div>
      )}

      {/* Active Filter Bar (when filtering by source or tag on homepage) */}
      {currentNavItem.template === 'home' && (activeSourceFilter || activeTagFilter) && (
        <div className="bg-[#22C55E]/5 border-b border-[#22C55E]/20 py-2.5 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#22C55E]" />
              <span className="font-semibold text-[#14181F]">Active Filters:</span>
              {activeSourceFilter && (
                <span className="bg-[#22C55E] text-white px-2.5 py-0.5 rounded-full font-medium">
                  Source: {activeSourceFilter}
                </span>
              )}
              {activeTagFilter && (
                <span className="bg-[#0A0F1A] text-white px-2.5 py-0.5 rounded-full font-medium">
                  Tag: #{activeTagFilter}
                </span>
              )}
            </div>

            <button
              onClick={() => {
                setActiveSourceFilter(null);
                setActiveTagFilter(null);
              }}
              className="flex items-center gap-1 text-[#22C55E] font-bold hover:underline cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* Main View Container */}
      <main className="flex-1">
        {loading ? (
          <div className="py-24 text-center">
            <RefreshCw className="w-8 h-8 text-[#22C55E] animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-[#5A6478]">
              Fetching live financial insights from MarketMaven wire...
            </p>
          </div>
        ) : (
          renderCurrentView()
        )}
      </main>

      {/* Editorial Footer */}
      <Footer
        topSources={topSources}
        onSelectCategory={(cat) =>
          handleNavigate({
            id: cat.toLowerCase(),
            label: cat,
            path: `/news/${cat.toLowerCase()}`,
            template: 'template-a',
          })
        }
        onSourceSelect={(src) => {
          setActiveSourceFilter(src);
          handleNavigate({
            id: 'home',
            label: 'Home',
            path: '/',
            template: 'home',
          });
        }}
        onNavigatePage={(template, label) =>
          handleNavigate({
            id: template,
            label,
            path: `/${template}`,
            template,
          })
        }
      />

      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        articles={articles}
        onSelectArticle={(art) => {
          setSearchModalOpen(false);
          handleOpenArticle(art);
        }}
      />

      <NewsletterModal
        isOpen={subscribeModalOpen}
        onClose={() => setSubscribeModalOpen(false)}
      />

      <TerminalTeaseModal
        isOpen={terminalModalOpen}
        onClose={() => setTerminalModalOpen(false)}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          Promise.all([
            apiClient.watchlist.get().catch(() => null),
            apiClient.savedArticles.get().catch(() => null),
          ]).then(([watchlistItems, savedList]) => {
            if (watchlistItems && Array.isArray(watchlistItems)) {
              // watchlist state is tracked by ticker symbol everywhere in
              // this app (MOCK_STOCKS lookups, includes() checks) — issuer_id
              // is a numeric FK the backend needs, not what the UI compares
              // against, and being always-truthy it silently won over
              // .ticker here.
              setWatchlist(watchlistItems.map((item) => item.ticker));
            }
            if (savedList && Array.isArray(savedList)) {
              setSavedArticleIds(savedList.map((item) => item.id));
            }
          });
        }}
        initialMode={authModalMode}
        promptMessage={authPromptMessage}
      />
    </div>
  );
}

