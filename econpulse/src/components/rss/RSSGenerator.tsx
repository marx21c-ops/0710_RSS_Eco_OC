'use client';

import { useState } from 'react';

export default function RSSGenerator() {
  const [source, setSource] = useState('');
  const [category, setCategory] = useState('');
  const [keyword, setKeyword] = useState('');
  const [limit, setLimit] = useState(20);
  const [generatedUrl, setGeneratedUrl] = useState('');

  const sources = [
    { value: '', label: '전체 매체' },
    { value: '연합뉴스', label: '연합뉴스' },
    { value: '매일경제', label: '매일경제' },
    { value: '한국경제', label: '한국경제' },
    { value: '파이낸셜뉴스', label: '파이낸셜뉴스' },
    { value: '헤럴드경제', label: '헤럴드경제' },
    { value: 'Bloomberg', label: 'Bloomberg' },
    { value: 'CNBC', label: 'CNBC' },
    { value: 'BBC Business', label: 'BBC Business' },
  ];

  const categories = [
    { value: '', label: '전체 카테고리' },
    { value: '경제일반', label: '경제일반' },
    { value: '종합경제', label: '종합경제' },
    { value: '종합금융', label: '종합금융' },
    { value: '마켓', label: '마켓' },
    { value: '비즈니스', label: '비즈니스' },
  ];

  const generateUrl = () => {
    const params = new URLSearchParams();
    if (source) params.append('source', source);
    if (category) params.append('category', category);
    if (keyword) params.append('keyword', keyword);
    params.append('limit', limit.toString());

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    const url = `${baseUrl}/api/rss-output?${params.toString()}`;
    setGeneratedUrl(url);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedUrl);
      alert('URL이 복사되었습니다.');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        RSS 피드 설정
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* 매체 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            매체
          </label>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {sources.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* 카테고리 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            카테고리
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* 키워드 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            키워드
          </label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="키워드 입력..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 결과 수 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            결과 수
          </label>
          <input
            type="number"
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value) || 20)}
            min={1}
            max={100}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex justify-end mb-6">
        <button
          onClick={generateUrl}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          RSS URL 생성
        </button>
      </div>

      {/* 생성된 URL */}
      {generatedUrl && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            생성된 RSS URL
          </h3>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={generatedUrl}
              readOnly
              className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
            />
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
            >
              복사
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            이 URL을 RSS 리더에 추가하여 구독하세요.
          </p>
        </div>
      )}
    </div>
  );
}