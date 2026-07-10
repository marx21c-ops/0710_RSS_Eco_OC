import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// AI 요약 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { newsId } = body;

    if (!newsId) {
      return NextResponse.json(
        { error: 'newsId is required' },
        { status: 400 }
      );
    }

    // 뉴스 조회
    const news = await prisma.news.findUnique({
      where: { id: newsId },
    });

    if (!news) {
      return NextResponse.json(
        { error: 'News not found' },
        { status: 404 }
      );
    }

    // 이미 요약이 있으면 기존 요약 반환
    if (news.aiSummary) {
      return NextResponse.json({ summary: news.aiSummary, keywords: news.keywords });
    }

    // TODO: OpenAI API를 사용한 AI 요약 생성
    // 현재는 간단한 요약 로직
    const text = `${news.title} ${news.summary || ''}`;
    const keywords = extractKeywords(text);
    const summary = generateSimpleSummary(news.title, news.summary);

    // DB 업데이트
    await prisma.news.update({
      where: { id: newsId },
      data: {
        aiSummary: summary,
        keywords,
      },
    });

    return NextResponse.json({ summary, keywords });
  } catch (error) {
    console.error('Error generating summary:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}

// 키워드 추출 함수
function extractKeywords(text: string): string[] {
  const keywords: string[] = [];
  const economicKeywords = [
    '금리', '인플레이션', '환율', '주식', '채권', '부동산', '경제성장',
    'GDP', '물가', '고용', '무역', '수출', '수입', '투자', '소비',
    '반도체', '자동차', '배터리', 'AI', '인공지능', '블록체인', '가상자산',
    '비트코인', '이더리움', 'stocks', 'market', 'economy', 'inflation',
    'interest rate', 'exchange rate', 'GDP', 'trade', 'investment',
  ];

  for (const keyword of economicKeywords) {
    if (text.toLowerCase().includes(keyword.toLowerCase())) {
      keywords.push(keyword);
    }
  }

  return keywords.slice(0, 5);
}

// 간단한 요약 생성 함수
function generateSimpleSummary(title: string, summary: string | null): string {
  if (!summary) {
    return title;
  }
  
  // 첫 200자로 요약
  const trimmed = summary.substring(0, 200);
  return trimmed.length < summary.length ? trimmed + '...' : trimmed;
}