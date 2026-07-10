import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 알림 목록 조회
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || 'default';

    const alerts = await prisma.alert.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ alerts });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}

// 알림 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, value, method, userId = 'default' } = body;

    if (!type || !value || !method) {
      return NextResponse.json(
        { error: 'type, value, and method are required' },
        { status: 400 }
      );
    }

    const alert = await prisma.alert.create({
      data: {
        userId,
        type,
        value,
        method,
      },
    });

    return NextResponse.json(alert);
  } catch (error) {
    console.error('Error creating alert:', error);
    return NextResponse.json(
      { error: 'Failed to create alert' },
      { status: 500 }
    );
  }
}