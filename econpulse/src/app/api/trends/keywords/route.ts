import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 트렌딩 키워드 조회
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const hours = parseInt(searchParams.get('hours') || '24');

    const startDate = new Date();
    startDate.setHours(startDate.getHours() - hours);

    const trendingKeywords = await prisma.trendKeyword.groupBy({
      by: ['keyword'],
      where: {
        hour: { gte: startDate },
      },
      _sum: { count: true },
      _count: { id: true },
      orderBy: { _sum: { count: 'desc' } },
      take: limit,
    });

    return NextResponse.json({
      keywords: trendingKeywords.map((t: any) => ({
        keyword: t.keyword,
        count: t._sum.count || 0,
        articles: t._count.id,
      })),
      period: `${hours}h`,
    });
  } catch (error) {
    console.error('Error fetching trending keywords:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trending keywords' },
      { status: 500 }
    );
  }
}