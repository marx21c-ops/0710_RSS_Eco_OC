import { NextRequest, NextResponse } from 'next/server';
import { collectAllFeeds, collectFeed } from '@/lib/rss-collector';

// RSS 수집 트리거
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { source } = body;

    let result;
    if (source) {
      result = await collectFeed(source);
    } else {
      result = await collectAllFeeds();
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error collecting feeds:', error);
    return NextResponse.json(
      { error: 'Failed to collect feeds' },
      { status: 500 }
    );
  }
}

// 수집 상태 조회
export async function GET() {
  try {
    const { prisma } = await import('@/lib/prisma');
    
    const recentLogs = await prisma.collectLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const totalNews = await prisma.news.count();
    const todayNews = await prisma.news.count({
      where: {
        collectedAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });

    return NextResponse.json({
      recentLogs,
      stats: {
        totalNews,
        todayNews,
      },
    });
  } catch (error) {
    console.error('Error fetching collection status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch collection status' },
      { status: 500 }
    );
  }
}