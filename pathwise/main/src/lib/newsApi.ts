// ─── News API Client ─────────────────────────────────────────────
import { NewsArticle, NewsCategory } from '../types';

const API_KEY = process.env.EXPO_PUBLIC_NEWS_API_KEY || '';
const BASE_URL = 'https://newsapi.org/v2';

// Map internal categories to NewsAPI categories
const CATEGORY_MAP: Record<string, string> = {
  tech: 'technology',
  finance: 'business',
  'public-sector': 'general',
  global: 'general',
};

// In-memory cache with TTL
let newsCache: {
  data: NewsArticle[];
  timestamp: number;
  category: string;
}[] = [];

const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

function getCached(category: string): NewsArticle[] | null {
  const cached = newsCache.find((c) => c.category === category);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
}

function setCache(category: string, data: NewsArticle[]) {
  newsCache = newsCache.filter((c) => c.category !== category);
  newsCache.push({ data, timestamp: Date.now(), category });
}

// Generate a stable ID from article data
function generateArticleId(title: string, source: string): string {
  const str = `${title}-${source}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

export async function fetchNews(category: NewsCategory = 'all'): Promise<NewsArticle[]> {
  // Check cache first
  const cached = getCached(category);
  if (cached) return cached;

  // If no API key, return curated fallback data
  if (!API_KEY || API_KEY === 'your-newsapi-key-here') {
    return getFallbackNews(category);
  }

  try {
    let url: string;

    if (category === 'all') {
      url = `${BASE_URL}/top-headlines?country=sg&pageSize=20&apiKey=${API_KEY}`;
    } else if (category === 'global') {
      url = `${BASE_URL}/everything?q=singapore+economy+workforce&language=en&sortBy=relevancy&pageSize=15&apiKey=${API_KEY}`;
    } else {
      const apiCategory = CATEGORY_MAP[category] || 'general';
      url = `${BASE_URL}/top-headlines?country=sg&category=${apiCategory}&pageSize=15&apiKey=${API_KEY}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'ok') {
      console.warn('NewsAPI error:', data.message);
      return getFallbackNews(category);
    }

    const articles: NewsArticle[] = (data.articles || [])
      .filter((a: any) => a.title && a.title !== '[Removed]')
      .map((a: any) => ({
        id: generateArticleId(a.title, a.source?.name || 'unknown'),
        title: a.title,
        description: a.description || 'No summary available.',
        source: a.source?.name || 'Unknown',
        url: a.url,
        imageUrl: a.urlToImage,
        publishedAt: a.publishedAt,
        category: category === 'all' ? inferCategory(a.title, a.description) : category,
      }));

    setCache(category, articles);
    return articles;
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return getFallbackNews(category);
  }
}

function inferCategory(title: string, description: string): NewsArticle['category'] {
  const text = `${title} ${description}`.toLowerCase();

  if (text.match(/tech|software|ai|digital|startup|cyber|data/)) return 'tech';
  if (text.match(/financ|bank|invest|economy|gdp|market|stock/)) return 'finance';
  if (text.match(/government|policy|minister|parliament|public/)) return 'public-sector';
  return 'global';
}

// ─── Fallback News (when API key not configured) ─────────────────

function getFallbackNews(category: NewsCategory): NewsArticle[] {
  const allNews: NewsArticle[] = [
    {
      id: 'f1',
      title: 'Singapore Expands SkillsFuture Credits for Mid-Career Workers',
      description: 'The government has announced enhanced SkillsFuture credits of up to $4,000 for workers aged 40 and above, aimed at encouraging continuous learning and career adaptability.',
      source: 'The Straits Times',
      url: 'https://straitstimes.com',
      publishedAt: new Date().toISOString(),
      category: 'public-sector',
    },
    {
      id: 'f2',
      title: 'Tech Sector Hiring Rebounds in Southeast Asia',
      description: 'After a period of correction, tech companies across Singapore are ramping up hiring in AI, cybersecurity, and cloud infrastructure roles.',
      source: 'TechInAsia',
      url: 'https://techinasia.com',
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      category: 'tech',
    },
    {
      id: 'f3',
      title: 'MAS Announces New Fintech Talent Programme',
      description: 'The Monetary Authority of Singapore launches a talent development programme to address the growing demand for fintech professionals in the region.',
      source: 'Business Times',
      url: 'https://businesstimes.com.sg',
      publishedAt: new Date(Date.now() - 7200000).toISOString(),
      category: 'finance',
    },
    {
      id: 'f4',
      title: 'NUS and NTU Launch Joint Micro-Credentials Platform',
      description: 'Singapore\'s top universities collaborate on a new platform offering stackable micro-credentials in emerging fields including sustainability, AI, and healthcare technology.',
      source: 'Channel NewsAsia',
      url: 'https://channelnewsasia.com',
      publishedAt: new Date(Date.now() - 10800000).toISOString(),
      category: 'tech',
    },
    {
      id: 'f5',
      title: 'Singapore Budget 2026: Key Workforce Development Measures',
      description: 'The latest budget allocates $3.6 billion for skills development and job transformation, with focus on AI literacy and green economy roles.',
      source: 'The Straits Times',
      url: 'https://straitstimes.com',
      publishedAt: new Date(Date.now() - 14400000).toISOString(),
      category: 'public-sector',
    },
    {
      id: 'f6',
      title: 'Global Recession Fears: What It Means for Singapore Workers',
      description: 'Economists weigh in on how global economic headwinds could impact Singapore\'s labour market and what professionals should prepare for.',
      source: 'Bloomberg',
      url: 'https://bloomberg.com',
      publishedAt: new Date(Date.now() - 18000000).toISOString(),
      category: 'global',
    },
    {
      id: 'f7',
      title: 'Demand for Data Engineers Surges 45% in Singapore',
      description: 'LinkedIn data reveals that data engineering roles have seen the highest growth in demand across Singapore\'s job market this quarter.',
      source: 'TechInAsia',
      url: 'https://techinasia.com',
      publishedAt: new Date(Date.now() - 21600000).toISOString(),
      category: 'tech',
    },
    {
      id: 'f8',
      title: 'DBS and OCBC Ramp Up Graduate Hiring Programmes',
      description: 'Major Singapore banks expand their graduate intake with new rotational programmes focusing on digital banking and risk analytics.',
      source: 'Business Times',
      url: 'https://businesstimes.com.sg',
      publishedAt: new Date(Date.now() - 25200000).toISOString(),
      category: 'finance',
    },
  ];

  if (category === 'all') return allNews;
  return allNews.filter((n) => n.category === category);
}
