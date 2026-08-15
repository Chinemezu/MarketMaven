// Shared click-resolution for an EditorsPickItem (used by both
// EditorsPicksSection and SpotlightPickSection, which show the same
// /editors-picks data in different layouts). A pick is either a report
// (resolved by slug, already supported) or an insight -- for insights,
// fetch the real Article via GET /insights/{id} rather than constructing
// a synthetic one with fabricated fields (a placeholder image URL, a
// made-up "4 min read", invented body text) as this used to do.

import { EditorsPickItem, Article } from '../types';
import { apiClient } from './apiClient';

export async function openEditorsPickItem(
  item: EditorsPickItem,
  onArticleClick: (article: Article) => void,
  onReportClick: (slug: string) => void
): Promise<void> {
  if (item.content_type === 'report') {
    onReportClick(item.url_or_slug);
    return;
  }
  try {
    const article = await apiClient.insights.getById(item.id);
    onArticleClick(article);
  } catch (err) {
    console.warn('Failed to load editors-pick insight:', err);
  }
}
