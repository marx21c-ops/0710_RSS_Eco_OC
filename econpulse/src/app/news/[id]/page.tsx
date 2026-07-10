'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import NewsSummary from '@/components/news/NewsSummary';
import BookmarkButton from '@/components/bookmark/BookmarkButton';

interface News {
  id: string;
  title: string;
  titleKr?: string;
  summary?: string;
  summaryKr?: string;
  aiSummary?: string;
  keywords: string[];
  content?: string;
  url: string;
  imageUrl?: string;
  source: string;
  category: string;
  lang: string;
  publishedAt: string;
  collectedAt: string;
}

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingSummary, setGeneratingSummary] = useState(false);

  useEffect(() => {
    fetchNews();
  }, [params.id]);

  const fetchNews = async () => {
    try {
      const response = await fetch(`/api/news/${params.id}`);
      if (!response.ok) {
        throw new Error('News not found');
      }
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!news) return;

    setGeneratingSummary(true);
    try {
      const response = await fetch('/api/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newsId: news.id }),
      });
      const data = await response.json();
      setNews((prev) =>
        prev
          ? { ...prev, aiSummary: data.summary, keywords: data.keywords }
          : null
      );
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setGeneratingSummary(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">뉴스를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-600">뉴스를 찾을 수 없습니다.</p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            뒤로 가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* 뒤로 가기 */}
      <button
        onClick={() => router.back()}
        className="mb-6 text-gray-600 hover:text-gray-900 flex items-center"
      >
        <svg
          className="w-5 h-5 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        뒤로 가기
      </button>

      {/* 기사 헤더 */}
      <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {news.source}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
              {news.category}
            </span>
          </div>
          <BookmarkButton newsId={news.id} />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {news.titleKr || news.title}
        </h1>

        <div className="flex items-center text-sm text-gray-500 mb-6">
          <time dateTime={news.publishedAt}>
            {formatDate(news.publishedAt)}
          </time>
          <span className="mx-2">·</span>
          <a
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            원문 보기 →
          </a>
        </div>

        {/* AI 요약 */}
        <NewsSummary
          summary={news.aiSummary}
          onGenerate={handleGenerateSummary}
          loading={generatingSummary}
        />

        {/* 요약 */}
        {(news.summaryKr || news.summary) && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">요약</h2>
            <p className="text-gray-700 leading-relaxed">
              {news.summaryKr || news.summary}
            </p>
          </div>
        )}

        {/* 키워드 */}
        {news.keywords.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              키워드
            </h2>
            <div className="flex flex-wrap gap-2">
              {news.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                >
                  #{keyword}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 본문 */}
        {news.content && (
          <div className="prose prose-lg max-w-none">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">본문</h2>
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {news.content}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}