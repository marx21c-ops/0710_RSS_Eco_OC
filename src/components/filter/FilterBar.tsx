'use client';

interface FilterBarProps {
  filters: {
    source: string;
    category: string;
    keyword: string;
  };
  onChange: (filters: FilterBarProps['filters']) => void;
}

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

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 매체 선택 */}
        <div>
          <label
            htmlFor="source"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            매체
          </label>
          <select
            id="source"
            value={filters.source}
            onChange={(e) => onChange({ ...filters, source: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            {sources.map((source) => (
              <option key={source.value} value={source.value}>
                {source.label}
              </option>
            ))}
          </select>
        </div>

        {/* 카테고리 선택 */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            카테고리
          </label>
          <select
            id="category"
            value={filters.category}
            onChange={(e) =>
              onChange({ ...filters, category: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* 키워드 검색 */}
        <div>
          <label
            htmlFor="keyword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            키워드
          </label>
          <input
            type="text"
            id="keyword"
            value={filters.keyword}
            onChange={(e) =>
              onChange({ ...filters, keyword: e.target.value })
            }
            placeholder="키워드 입력..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>
    </div>
  );
}