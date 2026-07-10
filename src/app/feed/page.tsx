'use client';

import { useState, useEffect } from 'react';
import NewsCard from '@/components/news/NewsCard';
import PreferenceForm from '@/components/feed/PreferenceForm';

interface News {
  id: string;
  title: string;
  titleKr?: string;
  summary?: string;
  summaryKr?: string;
  aiSummary?: string;
  keywords: string[];
  url: string;
  imageUrl?: string;
  source: string;
  category: string;
  lang: string;
  publishedAt: string;
}

interface Preferences {
  interestedSources: string[];
  interestedCategories: string[];
  interestedKeywords: string[];
  excludedSources: string[];
  excludedKeywords: string[];
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function FeedPage() {
  const [news, setNews] = useState<News[]>([]);
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    fetchFeed();
    fetchPreferences();
  }, []);

  const fetchFeed = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });

      const response = await fetch(`/api/feed?${params}`);
      const data = await response.json();
      setNews(data.news);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPreferences = async () => {
    try {
      const response = await fetch('/api/preferences');
      const data = await response.json();
      setPreferences(data);
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  };

  const handleSavePreferences = async (newPreferences: Preferences) => {
    try {
      await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPreferences),
      });
      setPreferences(newPreferences);
      setShowPreferences(false);
      fetchFeed(); // 설정 변경 후 피드 새로고침
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">내 피드</h1>
          <p className="text-gray-600">관심 있는 뉴스만 모아보세요</p>
        </div>
        <button
          onClick={() => setShowPreferences(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          설정
        </button>
      </div>

      {/* 현재 설정 표시 */}
      {preferences && (
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            현재 관심 설정
          </h3>
          <div className="flex flex-wrap gap-2">
            {preferences.interestedSources.length > 0 && (
              <div className="text-sm text-blue-700">
                <span className="font-medium">매체:</span>{' '}
                {preferences.interestedSources.join(', ')}
              </div>
            )}
            {preferences.interestedCategories.length > 0 && (
              <div className="text-sm text-blue-700">
                <span className="font-medium">카테고리:</span>{' '}
                {preferences.interestedCategories.join(', ')}
              </div>
            )}
            {preferences.interestedKeywords.length > 0 && (
              <div className="text-sm text-blue-700">
                <span className="font-medium">키워드:</span>{' '}
                {preferences.interestedKeywords.join(', ')}
              </div>
            )}
            {preferences.interestedSources.length === 0 &&
              preferences.interestedCategories.length === 0 &&
              preferences.interestedKeywords.length === 0 && (
                <p className="text-sm text-blue-600">
                  아직 설정이 없습니다. 설정 버튼을 눌러 관심 있는 뉴스를
                  설정하세요.
                </p>
              )}
          </div>
        </div>
      )}

      {/* 뉴스 피드 */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">뉴스를 불러오는 중...</p>
        </div>
      ) : news.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">표시할 뉴스가 없습니다.</p>
          <p className="text-sm text-gray-500 mt-2">
            설정을 변경하여 관심 있는 뉴스를 추가하세요.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {news.map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>

          {/* 페이지네이션 */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center space-x-2">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter(
                  (page) =>
                    page === 1 ||
                    page === pagination.totalPages ||
                    Math.abs(page - pagination.page) <= 2
                )
                .map((page, index, arr) => (
                  <div key={page} className="flex items-center">
                    {index > 0 && arr[index - 1] !== page - 1 && (
                      <span className="px-2 text-gray-400">...</span>
                    )}
                    <button
                      onClick={() => fetchFeed(page)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        page === pagination.page
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                      }`}
                    >
                      {page}
                    </button>
                  </div>
                ))}
            </div>
          )}
        </>
      )}

      {/* 설정 모달 */}
      {showPreferences && (
        <PreferenceForm
          preferences={preferences}
          onSave={handleSavePreferences}
          onCancel={() => setShowPreferences(false)}
        />
      )}
    </div>
  );
}