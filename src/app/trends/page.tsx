'use client';

import { useState, useEffect } from 'react';
import TrendTimeline from '@/components/trends/TrendTimeline';
import TrendingKeywords from '@/components/trends/TrendingKeywords';

interface TrendData {
  date: string;
  count: number;
}

interface KeywordData {
  keyword: string;
  count: number;
  articles: number;
}

export default function TrendsPage() {
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [keywordData, setKeywordData] = useState<KeywordData[]>([]);
  const [selectedKeyword, setSelectedKeyword] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendData();
  }, []);

  useEffect(() => {
    if (selectedKeyword) {
      fetchKeywordTrend(selectedKeyword);
    }
  }, [selectedKeyword]);

  const fetchTrendData = async () => {
    try {
      const response = await fetch('/api/trends/keywords?limit=20&hours=24');
      const data = await response.json();
      setKeywordData(data.keywords || []);
    } catch (error) {
      console.error('Error fetching trend data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchKeywordTrend = async (keyword: string) => {
    try {
      const response = await fetch(`/api/trends?keyword=${encodeURIComponent(keyword)}&days=7`);
      const data = await response.json();
      setTrendData(data.trends || []);
    } catch (error) {
      console.error('Error fetching keyword trend:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">트렌드 데이터 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">키워드 트렌드</h1>
        <p className="text-gray-600">시간에 따른 키워드 트렌드 분석</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 트렌딩 키워드 목록 */}
        <div className="lg:col-span-1">
          <TrendingKeywords
            keywords={keywordData}
            selected={selectedKeyword}
            onSelect={setSelectedKeyword}
          />
        </div>

        {/* 트렌드 타임라인 */}
        <div className="lg:col-span-2">
          <TrendTimeline
            keyword={selectedKeyword}
            data={trendData}
          />
        </div>
      </div>
    </div>
  );
}