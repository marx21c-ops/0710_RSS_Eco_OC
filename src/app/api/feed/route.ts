import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 개인화된 뉴스 피드 조회
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || 'default';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const skip = (page - 1) * limit;

    // 사용자 설정 조회
    const preferences = await prisma.userPreference.findUnique({
      where: { userId },
    });

    // 설정 기반 필터 구성
    const where: any = {};

    if (preferences) {
      // 관심 매체가 있으면 해당 매체만, 없으면 전체
      if (preferences.interestedSources.length > 0) {
        where.source = { in: preferences.interestedSources };
      }

      // 관심 카테고리가 있으면 해당 카테고리만
      if (preferences.interestedCategories.length > 0) {
        where.category = { in: preferences.interestedCategories };
      }

      // 관심 키워드가 있으면 해당 키워드 포함 기사
      if (preferences.interestedKeywords.length > 0) {
        where.keywords = { hasSome: preferences.interestedKeywords };
      }

      // 제외 매체 제외
      if (preferences.excludedSources.length > 0) {
        where.source = where.source
          ? { notIn: preferences.excludedSources }
          : { notIn: preferences.excludedSources };
      }
    }

    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.news.count({ where }),
    ]);

    return NextResponse.json({
      news,
      preferences,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching personalized feed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch personalized feed' },
      { status: 500 }
    );
  }
}