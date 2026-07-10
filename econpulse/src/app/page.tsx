'use client';

import { useState, useEffect } from 'react';
import NewsCard from '@/components/news/NewsCard';
import FilterBar from '@/components/filter/FilterBar';

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

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function HomePage() {
  const [news, setNews] = useState<News[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    source: '',
    category: '',
    keyword: '',
  });

  useEffect(() => {
    fetchNews();
  }, [filters]);

  const fetchNews = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });

      if (filters.source) params.append('source', filters.source);
      if (filters.category) params.append('category', filters.category);
      if (filters.keyword) params.append('keyword', filters.keyword);

      const response = await fetch(`/api/news?${params}`);
      const data = await response.json();
      setNews(data.news);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">경제 뉴스</h1>
        <p className="text-gray-600">
          국내외 경제 뉴스를 실시간으로 확인하세요
        </p>
      </div>

      {/* 필터 바 */}
      <FilterBar filters={filters} onChange={handleFilterChange} />

      {/* 뉴스 목록 */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">뉴스를 불러오는 중...</p>
        </div>
      ) : news.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">뉴스가 없습니다.</p>
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
                      onClick={() => fetchNews(page)}
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
    </div>
  );
}