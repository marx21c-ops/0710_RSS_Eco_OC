import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 개인화 설정 조회
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || 'default';

    const preferences = await prisma.userPreference.findUnique({
      where: { userId },
    });

    return NextResponse.json(preferences || {
      interestedSources: [],
      interestedCategories: [],
      interestedKeywords: [],
      excludedSources: [],
      excludedKeywords: [],
    });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preferences' },
      { status: 500 }
    );
  }
}

// 개인화 설정 저장/수정
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId = 'default',
      interestedSources = [],
      interestedCategories = [],
      interestedKeywords = [],
      excludedSources = [],
      excludedKeywords = [],
    } = body;

    const preferences = await prisma.userPreference.upsert({
      where: { userId },
      update: {
        interestedSources,
        interestedCategories,
        interestedKeywords,
        excludedSources,
        excludedKeywords,
        updatedAt: new Date(),
      },
      create: {
        userId,
        interestedSources,
        interestedCategories,
        interestedKeywords,
        excludedSources,
        excludedKeywords,
      },
    });

    return NextResponse.json(preferences);
  } catch (error) {
    console.error('Error saving preferences:', error);
    return NextResponse.json(
      { error: 'Failed to save preferences' },
      { status: 500 }
    );
  }
}