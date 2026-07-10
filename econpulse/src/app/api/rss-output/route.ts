import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// RSS 피드 생성
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const source = searchParams.get('source');
    const category = searchParams.get('category');
    const keyword = searchParams.get('keyword');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = {};
    if (source) where.source = source;
    if (category) where.category = category;
    if (keyword) where.keywords = { has: keyword };

    const news = await prisma.news.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      take: limit,
    });

    // RSS XML 생성
    const rssXml = generateRSS(news, {
      title: 'EconPulse News',
      description: '경제 뉴스 및 트렌드',
      link: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    });

    return new NextResponse(rssXml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Error generating RSS:', error);
    return NextResponse.json(
      { error: 'Failed to generate RSS' },
      { status: 500 }
    );
  }
}

// RSS XML 생성 함수
function generateRSS(news: any[], config: { title: string; description: string; link: string }): string {
  const items = news
    .map(
      (item) => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${item.url}</link>
      <description><![CDATA[${item.summary || item.title}]]></description>
      <source url="${item.url}">${item.source}</source>
      <category>${item.category}</category>
      <pubDate>${new Date(item.publishedAt).toUTCString()}</pubDate>
      <guid isPermaLink="false">${item.id}</guid>
    </item>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${config.title}</title>
    <description>${config.description}</description>
    <link>${config.link}</link>
    <atom:link href="${config.link}/api/rss-output" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;
}