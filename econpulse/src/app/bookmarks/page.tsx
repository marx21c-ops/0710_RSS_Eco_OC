'use client';

import { useState, useEffect } from 'react';
import NewsCard from '@/components/news/NewsCard';

interface Bookmark {
  id: string;
  newsId: string;
  createdAt: string;
  news: {
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
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });

      const response = await fetch(`/api/bookmarks?${params}`);
      const data = await response.json();
      setBookmarks(data.bookmarks);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">북마크</h1>
        <p className="text-gray-600">스크랩한 뉴스 모아보기</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">북마크를 불러오는 중...</p>
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">북마크한 뉴스가 없습니다.</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {bookmarks.map((bookmark) => (
              <NewsCard key={bookmark.id} news={bookmark.news} />
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
                      onClick={() => fetchBookmarks(page)}
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