'use client';

import Link from 'next/link';
import { useState } from 'react';

interface NewsCardProps {
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

export default function NewsCard({ news }: NewsCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (isBookmarked) {
        // 북마크 삭제 (실제로는 ID가 필요하지만 간소화)
        setIsBookmarked(false);
      } else {
        await fetch('/api/bookmarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newsId: news.id }),
        });
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  const getSourceColor = (source: string) => {
    const colors: Record<string, string> = {
      '연합뉴스': 'bg-blue-100 text-blue-800',
      '매일경제': 'bg-red-100 text-red-800',
      '한국경제': 'bg-green-100 text-green-800',
      '파이낸셜뉴스': 'bg-purple-100 text-purple-800',
      '헤럴드경제': 'bg-orange-100 text-orange-800',
      'Bloomberg': 'bg-gray-100 text-gray-800',
      'CNBC': 'bg-blue-100 text-blue-800',
      'BBC Business': 'bg-red-100 text-red-800',
    };
    return colors[source] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Link href={`/news/${news.id}`}>
      <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center space-x-2">
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${getSourceColor(
                news.source
              )}`}
            >
              {news.source}
            </span>
            <span className="text-xs text-gray-500">{news.category}</span>
          </div>
          <button
            onClick={handleBookmark}
            className={`p-1 rounded-full transition-colors ${
              isBookmarked
                ? 'text-yellow-500 hover:text-yellow-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <svg
              className="w-5 h-5"
              fill={isBookmarked ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </button>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {news.titleKr || news.title}
        </h3>

        {(news.aiSummary || news.summaryKr || news.summary) && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-3">
            {news.aiSummary || news.summaryKr || news.summary}
          </p>
        )}

        {news.keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {news.keywords.slice(0, 3).map((keyword) => (
              <span
                key={keyword}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
              >
                #{keyword}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center text-xs text-gray-500">
          <time dateTime={news.publishedAt}>
            {formatDate(news.publishedAt)}
          </time>
          <span className="mx-2">·</span>
          <span className="text-blue-600 hover:text-blue-800">원문 보기</span>
        </div>
      </article>
    </Link>
  );
}