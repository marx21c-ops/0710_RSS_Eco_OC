import Parser from 'rss-parser';
import { prisma } from './prisma';

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'EconPulse News Collector/1.0',
  },
});

// RSS 소스 정의
export const RSS_SOURCES = [
  // 한국 매체
  {
    name: '연합뉴스',
    url: 'https://www.yna.co.kr/rss/economy.xml',
    category: '경제일반',
    lang: 'ko',
  },
  {
    name: '매일경제',
    url: 'https://www.mk.co.kr/rss/30000001/',
    category: '종합경제',
    lang: 'ko',
  },
  {
    name: '한국경제',
    url: 'https://www.hankyung.com/feed/all-news',
    category: '종합경제',
    lang: 'ko',
  },
  {
    name: '파이낸셜뉴스',
    url: 'https://www.fnnews.com/rss/r20/fn_realnews_all.xml',
    category: '종합금융',
    lang: 'ko',
  },
  {
    name: '헤럴드경제',
    url: 'https://biz.heraldcorp.com/rss/google/newsAll',
    category: '경제일반',
    lang: 'ko',
  },
  // 해외 매체
  {
    name: 'Bloomberg',
    url: 'https://feeds.bloomberg.com/markets/news.rss',
    category: '마켓',
    lang: 'en',
  },
  {
    name: 'CNBC',
    url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html',
    category: '비즈니스',
    lang: 'en',
  },
  {
    name: 'BBC Business',
    url: 'https://feeds.bbci.co.uk/news/business/rss.xml',
    category: '비즈니스',
    lang: 'en',
  },
];

// 키워드 추출 함수
function extractKeywords(text: string): string[] {
  const keywords: string[] = [];
  const economicKeywords = [
    '금리', '인플레이션', '환율', '주식', '채권', '부동산', '경제성장',
    'GDP', '물가', '고용', '무역', '수출', '수입', '투자', '소비',
    '반도체', '자동차', '배터리', 'AI', '인공지능', '블록체인', '가상자산',
    '비트코인', '이더리움', 'stocks', 'market', 'economy', 'inflation',
    'interest rate', 'exchange rate', 'GDP', 'trade', 'investment',
  ];

  for (const keyword of economicKeywords) {
    if (text.toLowerCase().includes(keyword.toLowerCase())) {
      keywords.push(keyword);
    }
  }

  return keywords.slice(0, 5); // 최대 5개
}

// RSS 피드 수집
async function fetchFeed(source: typeof RSS_SOURCES[0]) {
  try {
    const feed = await parser.parseURL(source.url);
    const articles = [];

    for (const item of feed.items) {
      if (!item.title || !item.link) continue;

      const title = item.title;
      const summary = item.contentSnippet || item.content || '';
      const keywords = extractKeywords(`${title} ${summary}`);

      articles.push({
        title,
        summary: summary.substring(0, 500),
        url: item.link,
        imageUrl: item.enclosure?.url || null,
        source: source.name,
        category: source.category,
        lang: source.lang,
        keywords,
        publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
      });
    }

    return articles;
  } catch (error) {
    console.error(`Error fetching ${source.name}:`, error);
    return [];
  }
}

// 뉴스 저장 (중복 체크)
async function saveNews(articles: any[]) {
  let newCount = 0;

  for (const article of articles) {
    try {
      await prisma.news.upsert({
        where: { url: article.url },
        update: {},
        create: {
          title: article.title,
          summary: article.summary,
          url: article.url,
          imageUrl: article.imageUrl,
          source: article.source,
          category: article.category,
          lang: article.lang,
          keywords: article.keywords,
          publishedAt: article.publishedAt,
        },
      });
      newCount++;
    } catch (error) {
      console.error('Error saving article:', error);
    }
  }

  return newCount;
}

// 전체 RSS 수집 실행
export async function collectAllFeeds() {
  const startTime = Date.now();
  let totalCount = 0;
  let newCount = 0;
  let successCount = 0;
  let errorCount = 0;

  for (const source of RSS_SOURCES) {
    try {
      console.log(`Collecting from ${source.name}...`);
      const articles = await fetchFeed(source);
      totalCount += articles.length;

      const saved = await saveNews(articles);
      newCount += saved;
      successCount++;

      console.log(`✓ ${source.name}: ${articles.length} articles, ${saved} new`);
    } catch (error) {
      errorCount++;
      console.error(`✗ ${source.name} failed:`, error);
    }
  }

  const duration = Math.floor((Date.now() - startTime) / 1000);

  // 수집 로그 저장
  await prisma.collectLog.create({
    data: {
      source: 'all',
      count: totalCount,
      newCount,
      success: errorCount === 0,
      duration,
    },
  });

  return {
    totalCount,
    newCount,
    successCount,
    errorCount,
    duration,
  };
}

// 개별 소스 수집
export async function collectFeed(sourceName: string) {
  const source = RSS_SOURCES.find((s) => s.name === sourceName);
  if (!source) {
    throw new Error(`Source not found: ${sourceName}`);
  }

  const startTime = Date.now();
  const articles = await fetchFeed(source);
  const newCount = await saveNews(articles);
  const duration = Math.floor((Date.now() - startTime) / 1000);

  await prisma.collectLog.create({
    data: {
      source: source.name,
      count: articles.length,
      newCount,
      success: true,
      duration,
    },
  });

  return {
    source: source.name,
    totalCount: articles.length,
    newCount,
    duration,
  };
}