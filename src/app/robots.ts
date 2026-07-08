import type { MetadataRoute } from 'next';
import { BASE_URL } from '@/lib/seo';

/**
 * Robots policy: MAXIMIZE visibility — in Google AND in AI answers.
 *
 * Search/citation + user-initiated AI bots (OAI-SearchBot, ChatGPT-User,
 * Claude-SearchBot, Claude-User, PerplexityBot) are explicitly allowed so the
 * site can be cited when people ask assistants about UI/UX designers.
 * Training crawlers (GPTBot, ClaudeBot, CCBot) are ALSO allowed on purpose:
 * being in training data helps models "know" fandibayu.com. Only Bytespider
 * is blocked (ignores rules, no referral value).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },

      // AI search / citation / user-initiated fetchers — keep allowed.
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'Claude-SearchBot', allow: '/' },
      { userAgent: 'Claude-User', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },

      // Worst-behaved scraper; no search or AI-answer value.
      { userAgent: 'Bytespider', disallow: '/' },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
