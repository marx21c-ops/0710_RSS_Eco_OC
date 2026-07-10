import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 시간대별 수집 패턴 조회
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get('days') || '7');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // 최근 N일간의 수집 로그 조회
    const logs = await prisma.collectLog.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      orderBy: { createdAt: 'asc' },
    });

    // 시간대별로 그룹화
    const hourlyMap: Record<string, number> = {};
    for (let i = 0; i < 24; i++) {
      hourlyMap[`${i.toString().padStart(2, '0')}:00`] = 0;
    }

    logs.forEach((log) => {
      const hour = log.createdAt.getHours();
      const key = `${hour.toString().padStart(2, '0')}:00`;
      hourlyMap[key] += log.count;
    });

    const hourly = Object.entries(hourlyMap).map(([hour, count]) => ({
      hour,
      count,
    }));

    return NextResponse.json({ hourly });
  } catch (error) {
    console.error('Error fetching hourly stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hourly stats' },
      { status: 500 }
    );
  }
}