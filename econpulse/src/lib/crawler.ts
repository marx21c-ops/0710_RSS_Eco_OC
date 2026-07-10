import * as cheerio from 'cheerio';

// 뉴스 본문 크롤러 인터페이스
interface CrawlResult {
  success: boolean;
  content?: string;
  title?: string;
  description?: string;
  image?: string;
  error?: string;
}

// 매체별 크롤러 설정
const CRAWLER_CONFIGS: Record<string, {
  contentSelector: string;
  titleSelector?: string;
  descriptionSelector?: string;
  imageSelector?: string;
}> = {
  '연합뉴스': {
    contentSelector: '.articleConts',
    titleSelector: '.tit_view',
    descriptionSelector: '.lead',
    imageSelector: '.img_area img',
  },
  '매일경제': {
    contentSelector: '.art_txt',
    titleSelector: '.news_ttl',
    descriptionSelector: '.news_summary',
    imageSelector: '.thumb_img img',
  },
  '한국경제': {
    contentSelector: '.article-conts',
    titleSelector: '.article-title',
    descriptionSelector: '.article-summary',
    imageSelector: '.article-img img',
  },
  '파이낸셜뉴스': {
    contentSelector: '.article_txt',
    titleSelector: '.title_view',
    descriptionSelector: '.lead_txt',
    imageSelector: '.img_wrap img',
  },
  '헤럴드경제': {
    contentSelector: '.article-content',
    titleSelector: '.title',
    descriptionSelector: '.article-summary',
    imageSelector: '.article-img img',
  },
  'Bloomberg': {
    contentSelector: '.body-content',
    titleSelector: 'h1',
    descriptionSelector: '.lede-text',
    imageSelector: '.media-platform-image img',
  },
  'CNBC': {
    contentSelector: '.ArticleBody-articleBody',
    titleSelector: '.ArticleHeader-headline',
    descriptionSelector: '.ArticleHeader-subtitle',
    imageSelector: '.FeaturedArticle-image img',
  },
  'BBC Business': {
    contentSelector: '[data-component="text-block"]',
    titleSelector: 'h1',
    descriptionSelector: '.sc-4fedabc4-0',
    imageSelector: '.sc-9a8b9d4f-0 img',
  },
};

// HTML에서 텍스트 추출
function extractText($: cheerio.CheerioAPI, selector: string): string {
  const element = $(selector);
  if (!element.length) return '';
  
  // 텍스트만 추출 (HTML 태그 제거)
  return element
    .text()
    .replace(/\s+/g, ' ')
    .trim();
}

// 이미지 URL 추출
function extractImage($: cheerio.CheerioAPI, selector: string, baseUrl: string): string | null {
  const element = $(selector);
  if (!element.length) return null;
  
  const src = element.attr('src') || element.attr('data-src') || '';
  if (!src) return null;
  
  // 상대 경로를 절대 경로로 변환
  if (src.startsWith('//')) {
    return `https:${src}`;
  }
  if (src.startsWith('/')) {
    return new URL(src, baseUrl).toString();
  }
  return src;
}

// 뉴스 본문 크롤링
export async function crawlNewsContent(
  url: string,
  source: string
): Promise<CrawlResult> {
  try {
    const config = CRAWLER_CONFIGS[source];
    if (!config) {
      return {
        success: false,
        error: `크롤러 설정이 없는 매체: ${source}`,
      };
    }

    // HTTP 요청
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
      },
    });

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // 본문 추출
    const content = extractText($, config.contentSelector);
    
    // 제목 추출 (파라미터로 받은 제목 사용)
    const title = config.titleSelector
      ? extractText($, config.titleSelector)
      : undefined;
    
    // 요약 추출
    const description = config.descriptionSelector
      ? extractText($, config.descriptionSelector)
      : undefined;
    
    // 이미지 추출
    const image = config.imageSelector
      ? extractImage($, config.imageSelector, url)
      : undefined;

    if (!content) {
      return {
        success: false,
        error: '본문을 찾을 수 없습니다.',
      };
    }

    return {
      success: true,
      content,
      title: title || undefined,
      description: description || undefined,
      image: image || undefined,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '크롤링 중 오류 발생',
    };
  }
}

// 크롤러 설정 조회
export function getCrawlerConfig(source: string) {
  return CRAWLER_CONFIGS[source] || null;
}

// 지원하는 매체 목록
export function getSupportedSources() {
  return Object.keys(CRAWLER_CONFIGS);
}