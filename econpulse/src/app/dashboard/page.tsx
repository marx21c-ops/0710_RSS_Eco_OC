'use client';

import { useState, useEffect } from 'react';
import SourceChart from '@/components/dashboard/SourceChart';
import TrendChart from '@/components/dashboard/TrendChart';
import KeywordCloud from '@/components/dashboard/KeywordCloud';

interface Stats {
  totalNews: number;
  todayNews: number;
  totalSources: number;
  totalKeywords: number;
}

interface SourceCount {
  source: string;
  count: number;
}

interface TrendData {
  date: string;
  count: number;
}

interface KeywordCount {
  keyword: string;
  count: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [sourceData, setSourceData] = useState<SourceCount[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [keywordData, setKeywordData] = useState<KeywordCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // 뉴스 통계 조회
      const newsResponse = await fetch('/api/news?limit=1');
      const newsData = await newsResponse.json();
      
      // 트렌드 데이터 조회
      const trendResponse = await fetch('/api/trends?days=7');
      const trendResult = await trendResponse.json();
      
      // 트렌딩 키워드 조회
      const keywordResponse = await fetch('/api/trends/keywords?limit=20');
      const keywordResult = await keywordResponse.json();

      setStats({
        totalNews: newsData.pagination.total,
        todayNews: 0, // TODO: 오늘 날짜 필터링
        totalSources: 8,
        totalKeywords: keywordResult.keywords?.length || 0,
      });

      setTrendData(trendResult.trends || []);
      setKeywordData(keywordResult.keywords || []);

      // 매체별 뉴스 수 조회 (임시 데이터)
      setSourceData([
        { source: '연합뉴스', count: 150 },
        { source: '매일경제', count: 120 },
        { source: '한국경제', count: 100 },
        { source: '파이낸셜뉴스', count: 80 },
        { source: '헤럴드경제', count: 70 },
        { source: 'Bloomberg', count: 60 },
        { source: 'CNBC', count: 50 },
        { source: 'BBC Business', count: 40 },
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">대시보드 데이터 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">대시보드</h1>
        <p className="text-gray-600">뉴스 수집 현황 및 트렌드 분석</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-500">전체 뉴스</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">
            {stats?.totalNews.toLocaleString() || 0}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-500">오늘 수집</div>
          <div className="mt-2 text-3xl font-bold text-blue-600">
            {stats?.todayNews.toLocaleString() || 0}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-500">매체 수</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">
            {stats?.totalSources || 0}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-500">트렌딩 키워드</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">
            {stats?.totalKeywords || 0}
          </div>
        </div>
      </div>

      {/* 차트 영역 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <SourceChart data={sourceData} />
        <TrendChart data={trendData} />
      </div>

      {/* 키워드 클라우드 */}
      <KeywordCloud keywords={keywordData} />
    </div>
  );
}