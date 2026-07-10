import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 뉴스 목록 조회
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const source = searchParams.get('source');
    const category = searchParams.get('category');
    const keyword = searchParams.get('keyword');

    const skip = (page - 1) * limit;

    const where: any = {};
    if (source) where.source = source;
    if (category) where.category = category;
    if (keyword) {
      where.keywords = { has: keyword };
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
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}