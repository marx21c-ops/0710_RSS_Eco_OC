import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 북마크 목록 조회
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const userId = searchParams.get('userId') || 'default';

    const skip = (page - 1) * limit;

    const [bookmarks, total] = await Promise.all([
      prisma.bookmark.findMany({
        where: { userId },
        include: { news: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.bookmark.count({ where: { userId } }),
    ]);

    return NextResponse.json({
      bookmarks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookmarks' },
      { status: 500 }
    );
  }
}

// 북마크 추가
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { newsId, userId = 'default' } = body;

    if (!newsId) {
      return NextResponse.json(
        { error: 'newsId is required' },
        { status: 400 }
      );
    }

    const bookmark = await prisma.bookmark.upsert({
      where: {
        userId_newsId: { userId, newsId },
      },
      update: {},
      create: {
        userId,
        newsId,
      },
    });

    return NextResponse.json(bookmark);
  } catch (error) {
    console.error('Error creating bookmark:', error);
    return NextResponse.json(
      { error: 'Failed to create bookmark' },
      { status: 500 }
    );
  }
}