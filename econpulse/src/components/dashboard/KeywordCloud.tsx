'use client';

interface KeywordCloudProps {
  keywords: {
    keyword: string;
    count: number;
  }[];
}

export default function KeywordCloud({ keywords }: KeywordCloudProps) {
  const maxCount = Math.max(...keywords.map((k) => k.count), 1);

  const getSize = (count: number) => {
    const size = (count / maxCount) * 24 + 14;
    return `${size}px`;
  };

  const getColor = (count: number) => {
    const ratio = count / maxCount;
    if (ratio > 0.8) return 'text-blue-700';
    if (ratio > 0.6) return 'text-blue-600';
    if (ratio > 0.4) return 'text-blue-500';
    if (ratio > 0.2) return 'text-blue-400';
    return 'text-blue-300';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        트렌딩 키워드
      </h2>
      <div className="flex flex-wrap gap-4 justify-center items-center min-h-[200px]">
        {keywords.length === 0 ? (
          <p className="text-gray-500">트렌딩 키워드가 없습니다.</p>
        ) : (
          keywords.map((item) => (
            <span
              key={item.keyword}
              className={`font-bold hover:text-blue-800 cursor-pointer transition-colors ${getColor(
                item.count
              )}`}
              style={{ fontSize: getSize(item.count) }}
              title={`${item.count}건`}
            >
              {item.keyword}
            </span>
          ))
        )}
      </div>
    </div>
  );
}