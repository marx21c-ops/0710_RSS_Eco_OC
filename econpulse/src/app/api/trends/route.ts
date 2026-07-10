import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 트렌드 데이터 조회
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const keyword = searchParams.get('keyword');
    const days = parseInt(searchParams.get('days') || '7');

    // 최근 N일간의 트렌드 데이터 조회
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    if (keyword) {
      // 특정 키워드의 트렌드
      const trends = await prisma.trendKeyword.groupBy({
        by: ['hour'],
        where: {
          keyword,
          hour: { gte: startDate },
        },
        _sum: { count: true },
        orderBy: { hour: 'asc' },
      });

      return NextResponse.json({
        keyword,
        trends: trends.map((t: any) => ({
          date: t.hour,
          count: t._sum.count || 0,
        })),
      });
    }

    // 전체 트렌딩 키워드
    const trendingKeywords = await prisma.trendKeyword.groupBy({
      by: ['keyword'],
      where: {
        hour: { gte: startDate },
      },
      _sum: { count: true },
      orderBy: { _sum: { count: 'desc' } },
      take: 20,
    });

    return NextResponse.json({
      trending: trendingKeywords.map((t: any) => ({
        keyword: t.keyword,
        count: t._sum.count || 0,
      })),
    });
  } catch (error) {
    console.error('Error fetching trends:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trends' },
      { status: 500 }
    );
  }
}