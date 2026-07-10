'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface TrendTimelineProps {
  keyword: string;
  data: {
    date: string;
    count: number;
  }[];
}

export default function TrendTimeline({ keyword, data }: TrendTimelineProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        {keyword ? `"${keyword}" 트렌드` : '키워드를 선택하세요'}
      </h2>
      <div className="h-96">
        {keyword ? (
          data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              데이터가 없습니다.
            </div>
          )
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            왼쪽에서 키워드를 선택하세요.
          </div>
        )}
      </div>
    </div>
  );
}