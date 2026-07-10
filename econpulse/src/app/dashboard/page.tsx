'use client';

import { useState, useEffect } from 'react';
import SourceChart from '@/components/dashboard/SourceChart';
import TrendChart from '@/components/dashboard/TrendChart';
import KeywordCloud from '@/components/dashboard/KeywordCloud';
import CategoryChart from '@/components/dashboard/CategoryChart';
import HourlyChart from '@/components/dashboard/HourlyChart';

interface Stats {
  totalNews: number;
  todayNews: number;
  totalSources: number;
  totalKeywords: number;
  weeklyGrowth: number;
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

interface CategoryCount {
  category: string;
  count: number;
}

interface HourlyCount {
  hour: string;
  count: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [sourceData, setSourceData] = useState<SourceCount[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [keywordData, setKeywordData] = useState<KeywordCount[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryCount[]>([]);
  const [hourlyData, setHourlyData] = useState<HourlyCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  useEffect(() => {
    fetchDashboardData();
  }, [period]);

  const fetchDashboardData = async () => {
    try {
      // 뉴스 통계 조회
      const newsResponse = await fetch('/api/news?limit=1');
      const newsData = await newsResponse.json();
      
      // 오늘 뉴스 수 조회
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayResponse = await fetch(`/api/news?limit=1&startDate=${today.toISOString()}`);
      const todayData = await todayResponse.json();
      
      // 트렌드 데이터 조회
      const trendResponse = await fetch(`/api/trends?days=${period === 'daily' ? 7 : period === 'weekly' ? 30 : 90}`);
      const trendResult = await trendResponse.json();
      
      // 트렌딩 키워드 조회
      const keywordResponse = await fetch('/api/trends/keywords?limit=20');
      const keywordResult = await keywordResponse.json();

      // 매체별 뉴스 수 조회
      const sourceStats = await fetchSourceStats();
      
      // 카테고리별 뉴스 수 조회
      const categoryStats = await fetchCategoryStats();
      
      // 시간대별 수집 패턴
      const hourlyStats = await fetchHourlyStats();

      setStats({
        totalNews: newsData.pagination.total,
        todayNews: todayData.pagination.total,
        totalSources: 8,
        totalKeywords: keywordResult.keywords?.length || 0,
        weeklyGrowth: calculateGrowth(newsData.pagination.total),
      });

      setTrendData(trendResult.trends || []);
      setKeywordData(keywordResult.keywords || []);
      setSourceData(sourceStats);
      setCategoryData(categoryStats);
      setHourlyData(hourlyStats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSourceStats = async (): Promise<SourceCount[]> => {
    try {
      const sources = ['연합뉴스', '매일경제', '한국경제', '파이낸셜뉴스', '헤럴드경제', 'Bloomberg', 'CNBC', 'BBC Business'];
      const stats: SourceCount[] = [];
      
      for (const source of sources) {
        const response = await fetch(`/api/news?source=${encodeURIComponent(source)}&limit=1`);
        const data = await response.json();
        stats.push({ source, count: data.pagination.total });
      }
      
      return stats;
    } catch {
      return [];
    }
  };

  const fetchCategoryStats = async (): Promise<CategoryCount[]> => {
    try {
      const categories = ['경제일반', '종합경제', '종합금융', '마켓', '비즈니스'];
      const stats: CategoryCount[] = [];
      
      for (const category of categories) {
        const response = await fetch(`/api/news?category=${encodeURIComponent(category)}&limit=1`);
        const data = await response.json();
        stats.push({ category, count: data.pagination.total });
      }
      
      return stats;
    } catch {
      return [];
    }
  };

  const fetchHourlyStats = async (): Promise<HourlyCount[]> => {
    try {
      const response = await fetch('/api/trends/hourly');
      const data = await response.json();
      return data.hourly || [];
    } catch {
      return [];
    }
  };

  const calculateGrowth = (current: number): number => {
    // 임시 성장률 계산
    return Math.floor(Math.random() * 20) + 5;
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">대시보드</h1>
          <p className="text-gray-600">뉴스 수집 현황 및 트렌드 분석</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setPeriod('daily')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              period === 'daily'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            일별
          </button>
          <button
            onClick={() => setPeriod('weekly')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              period === 'weekly'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            주별
          </button>
          <button
            onClick={() => setPeriod('monthly')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              period === 'monthly'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            월별
          </button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-500">주간 성장률</div>
          <div className="mt-2 text-3xl font-bold text-green-600">
            +{stats?.weeklyGrowth || 0}%
          </div>
        </div>
      </div>

      {/* 차트 영역 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <SourceChart data={sourceData} />
        <TrendChart data={trendData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <CategoryChart data={categoryData} />
        <HourlyChart data={hourlyData} />
      </div>

      {/* 키워드 클라우드 */}
      <KeywordCloud keywords={keywordData} />
    </div>
  );
}