'use client';

import { useState } from 'react';

interface RSSFeed {
  id: string;
  name: string;
  url: string;
  createdAt: string;
}

export default function RSSGenerator() {
  const [source, setSource] = useState('');
  const [category, setCategory] = useState('');
  const [keyword, setKeyword] = useState('');
  const [limit, setLimit] = useState(20);
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [savedFeeds, setSavedFeeds] = useState<RSSFeed[]>([]);
  const [feedName, setFeedName] = useState('');

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

  const saveFeed = () => {
    if (!generatedUrl || !feedName.trim()) return;

    const newFeed: RSSFeed = {
      id: Date.now().toString(),
      name: feedName.trim(),
      url: generatedUrl,
      createdAt: new Date().toISOString(),
    };

    setSavedFeeds([...savedFeeds, newFeed]);
    setFeedName('');
    alert('피드가 저장되었습니다.');
  };

  const deleteFeed = (id: string) => {
    setSavedFeeds(savedFeeds.filter((feed) => feed.id !== id));
  };

  const previewFeed = async () => {
    if (!generatedUrl) return;
    window.open(generatedUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* RSS 피드 생성기 */}
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

        <div className="flex justify-end space-x-2 mb-6">
          <button
            onClick={previewFeed}
            disabled={!generatedUrl}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            미리보기
          </button>
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

            {/* 피드 저장 */}
            <div className="mt-4 flex items-center space-x-2">
              <input
                type="text"
                value={feedName}
                onChange={(e) => setFeedName(e.target.value)}
                placeholder="피드 이름 입력..."
                className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
              />
              <button
                onClick={saveFeed}
                disabled={!feedName.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                저장
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 저장된 피드 목록 */}
      {savedFeeds.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            저장된 RSS 피드
          </h2>
          <div className="space-y-3">
            {savedFeeds.map((feed) => (
              <div
                key={feed.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {feed.name}
                  </p>
                  <p className="text-sm text-gray-500 truncate">{feed.url}</p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => window.open(feed.url, '_blank')}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    열기
                  </button>
                  <button
                    onClick={() => navigator.clipboard.writeText(feed.url)}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                  >
                    복사
                  </button>
                  <button
                    onClick={() => deleteFeed(feed.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 안내 사항 */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2">사용 안내</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• 생성된 RSS URL을 RSS 리더에 추가하여 구독하세요.</li>
          <li>
            • 지원하는 RSS 리더: Feedly, Inoreader, NewsBlur, Netvibes 등
          </li>
          <li>• 키워드를 설정하면 특정 키워드가 포함된 뉴스만 수신됩니다.</li>
          <li>
            • Zapier, IFTTT 등 자동화 도구와 연동하여 알림을 받을 수도
            있습니다.
          </li>
        </ul>
      </div>
    </div>
  );
}