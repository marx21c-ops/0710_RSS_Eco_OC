'use client';

interface NewsSummaryProps {
  summary?: string;
  onGenerate: () => void;
  loading: boolean;
}

export default function NewsSummary({
  summary,
  onGenerate,
  loading,
}: NewsSummaryProps) {
  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <span className="mr-2">🤖</span>
          AI 요약
        </h2>
        {!summary && (
          <button
            onClick={onGenerate}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                생성 중...
              </span>
            ) : (
              '요약 생성'
            )}
          </button>
        )}
      </div>

      {summary ? (
        <p className="text-gray-700 leading-relaxed">{summary}</p>
      ) : (
        <p className="text-gray-500 text-sm">
          AI가 기사를 분석하여 핵심 내용을 요약해드립니다.
        </p>
      )}
    </div>
  );
}