'use client';

interface TrendingKeywordsProps {
  keywords: {
    keyword: string;
    count: number;
    articles: number;
  }[];
  selected: string;
  onSelect: (keyword: string) => void;
}

export default function TrendingKeywords({
  keywords,
  selected,
  onSelect,
}: TrendingKeywordsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        트렌딩 키워드
      </h2>
      <div className="space-y-2">
        {keywords.length === 0 ? (
          <p className="text-gray-500">트렌딩 키워드가 없습니다.</p>
        ) : (
          keywords.map((item, index) => (
            <button
              key={item.keyword}
              onClick={() => onSelect(item.keyword)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                selected === item.keyword
                  ? 'bg-blue-50 border border-blue-200'
                  : 'hover:bg-gray-50 border border-transparent'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-400 mr-3">
                    {index + 1}
                  </span>
                  <span className="font-medium text-gray-900">
                    {item.keyword}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {item.count}건
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}