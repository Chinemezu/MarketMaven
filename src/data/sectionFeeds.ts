// Maps a Market News nav item id to the real GET /insights params it
// should fetch with. Previously these sections all reused the single,
// globally-loaded `articles` array (fetched once with sort=relevance, no
// vertical) and filtered it client-side by fuzzy-matching the nav label
// against each article's category string -- "Stock Market" never matched
// "Finance", so that section silently fell back to an arbitrary slice of
// whatever was in the global list, not real finance-vertical news.

export interface SectionFeedParams {
  vertical?: string;
  sort?: 'relevance' | 'recent';
  limit?: number;
}

export const SECTION_FEEDS: Record<string, SectionFeedParams> = {
  'news': { sort: 'recent', limit: 24 }, // parent "Market News" nav item, if selected directly rather than a child
  'news-latest': { sort: 'recent', limit: 24 },
  'news-stock-market': { vertical: 'finance', limit: 24 },
  'news-currencies': { vertical: 'forex', limit: 24 },
  'news-crypto': { vertical: 'crypto', limit: 24 },
};

export function sectionFeedParams(navItemId: string): SectionFeedParams | undefined {
  return SECTION_FEEDS[navItemId];
}
