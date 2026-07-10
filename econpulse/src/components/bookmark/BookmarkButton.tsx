'use client';

import { useState, useEffect } from 'react';

interface BookmarkButtonProps {
  newsId: string;
}

export default function BookmarkButton({ newsId }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkBookmark();
  }, [newsId]);

  const checkBookmark = async () => {
    try {
      const response = await fetch('/api/bookmarks');
      const data = await response.json();
      const exists = data.bookmarks.some(
        (b: any) => b.newsId === newsId
      );
      setIsBookmarked(exists);
    } catch (error) {
      console.error('Error checking bookmark:', error);
    }
  };

  const handleToggle = async () => {
    setLoading(true);
    try {
      if (isBookmarked) {
        // 북마크 삭제
        const response = await fetch('/api/bookmarks');
        const data = await response.json();
        const bookmark = data.bookmarks.find(
          (b: any) => b.newsId === newsId
        );
        if (bookmark) {
          await fetch(`/api/bookmarks/${bookmark.id}`, {
            method: 'DELETE',
          });
        }
        setIsBookmarked(false);
      } else {
        // 북마크 추가
        await fetch('/api/bookmarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newsId }),
        });
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        isBookmarked
          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      } disabled:opacity-50`}
    >
      <svg
        className={`w-5 h-5 mr-2 ${isBookmarked ? 'text-yellow-500' : 'text-gray-400'}`}
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
      {isBookmarked ? '북마크됨' : '북마크'}
    </button>
  );
}