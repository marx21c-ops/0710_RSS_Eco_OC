'use client';

import { useState } from 'react';

interface Preferences {
  interestedSources: string[];
  interestedCategories: string[];
  interestedKeywords: string[];
  excludedSources: string[];
  excludedKeywords: string[];
}

interface PreferenceFormProps {
  preferences: Preferences | null;
  onSave: (preferences: Preferences) => void;
  onCancel: () => void;
}

export default function PreferenceForm({
  preferences,
  onSave,
  onCancel,
}: PreferenceFormProps) {
  const [interestedSources, setInterestedSources] = useState<string[]>(
    preferences?.interestedSources || []
  );
  const [interestedCategories, setInterestedCategories] = useState<string[]>(
    preferences?.interestedCategories || []
  );
  const [interestedKeywords, setInterestedKeywords] = useState<string[]>(
    preferences?.interestedKeywords || []
  );
  const [excludedSources, setExcludedSources] = useState<string[]>(
    preferences?.excludedSources || []
  );
  const [excludedKeywords, setExcludedKeywords] = useState<string[]>(
    preferences?.excludedKeywords || []
  );
  const [newKeyword, setNewKeyword] = useState('');

  const sources = [
    '연합뉴스',
    '매일경제',
    '한국경제',
    '파이낸셜뉴스',
    '헤럴드경제',
    'Bloomberg',
    'CNBC',
    'BBC Business',
  ];

  const categories = [
    '경제일반',
    '종합경제',
    '종합금융',
    '마켓',
    '비즈니스',
  ];

  const toggleSource = (source: string, type: 'interested' | 'excluded') => {
    if (type === 'interested') {
      setInterestedSources((prev) =>
        prev.includes(source)
          ? prev.filter((s) => s !== source)
          : [...prev, source]
      );
    } else {
      setExcludedSources((prev) =>
        prev.includes(source)
          ? prev.filter((s) => s !== source)
          : [...prev, source]
      );
    }
  };

  const toggleCategory = (category: string) => {
    setInterestedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !interestedKeywords.includes(newKeyword.trim())) {
      setInterestedKeywords((prev) => [...prev, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setInterestedKeywords((prev) => prev.filter((k) => k !== keyword));
  };

  const addExcludedKeyword = () => {
    if (newKeyword.trim() && !excludedKeywords.includes(newKeyword.trim())) {
      setExcludedKeywords((prev) => [...prev, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const removeExcludedKeyword = (keyword: string) => {
    setExcludedKeywords((prev) => prev.filter((k) => k !== keyword));
  };

  const handleSave = () => {
    onSave({
      interestedSources,
      interestedCategories,
      interestedKeywords,
      excludedSources,
      excludedKeywords,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">관심 설정</h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* 관심 매체 */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              관심 매체
            </h3>
            <div className="flex flex-wrap gap-2">
              {sources.map((source) => (
                <button
                  key={source}
                  onClick={() => toggleSource(source, 'interested')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    interestedSources.includes(source)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {source}
                </button>
              ))}
            </div>
          </div>

          {/* 관심 카테고리 */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              관심 카테고리
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    interestedCategories.includes(category)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* 관심 키워드 */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              관심 키워드
            </h3>
            <div className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                placeholder="키워드 입력..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <button
                onClick={addKeyword}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                추가
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {interestedKeywords.map((keyword) => (
                <span
                  key={keyword}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center"
                >
                  {keyword}
                  <button
                    onClick={() => removeKeyword(keyword)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* 제외 매체 */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              제외 매체
            </h3>
            <div className="flex flex-wrap gap-2">
              {sources.map((source) => (
                <button
                  key={source}
                  onClick={() => toggleSource(source, 'excluded')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    excludedSources.includes(source)
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {source}
                </button>
              ))}
            </div>
          </div>

          {/* 제외 키워드 */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              제외 키워드
            </h3>
            <div className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addExcludedKeyword()}
                placeholder="제외할 키워드 입력..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <button
                onClick={addExcludedKeyword}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
              >
                추가
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {excludedKeywords.map((keyword) => (
                <span
                  key={keyword}
                  className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm flex items-center"
                >
                  {keyword}
                  <button
                    onClick={() => removeExcludedKeyword(keyword)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end space-x-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}