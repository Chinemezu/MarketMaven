import { Article, TopSource, NewsletterSignupResponse } from '../types';
import { INITIAL_ARTICLES, INITIAL_TOP_SOURCES } from '../data/mockArticles';
import { apiClient } from './apiClient';

export async function fetchInsights(params: {
  sort?: 'relevance' | 'recent';
  limit?: number;
  featured?: boolean;
  featured_order?: number;
  category?: string;
  search?: string;
  exclude_ids?: string[];
}): Promise<Article[]> {
  try {
    return await apiClient.insights.get(params);
  } catch (err) {
    console.warn('API fetch fallback triggered:', err);
    let articles = [...INITIAL_ARTICLES];
    if (params.category && params.category !== 'All') {
      articles = articles.filter(a => a.category.toLowerCase() === params.category?.toLowerCase());
    }
    return articles;
  }
}

export async function fetchTopSources(): Promise<TopSource[]> {
  try {
    return await apiClient.insights.topSources();
  } catch (err) {
    return INITIAL_TOP_SOURCES;
  }
}

export async function submitNewsletterSignup(email: string): Promise<NewsletterSignupResponse> {
  const res = await apiClient.newsletter.signup(email);
  return {
    success: res.success,
    status: (res.already_subscribed ? 'already_subscribed' : 'subscribed') as 'subscribed' | 'already_subscribed',
    message: res.message,
    email: res.email,
  };
}
