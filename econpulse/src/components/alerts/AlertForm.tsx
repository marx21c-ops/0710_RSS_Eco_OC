'use client';

import { useState } from 'react';

interface AlertFormProps {
  onSubmit: (alert: {
    type: string;
    value: string;
    method: string;
    active: boolean;
  }) => void;
  onCancel: () => void;
}

export default function AlertForm({ onSubmit, onCancel }: AlertFormProps) {
  const [type, setType] = useState('keyword');
  const [value, setValue] = useState('');
  const [method, setMethod] = useState('email');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;

    onSubmit({
      type,
      value: value.trim(),
      method,
      active: true,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">새 알림 추가</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* 알림 유형 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              알림 유형
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="keyword">키워드</option>
              <option value="source">매체</option>
              <option value="category">카테고리</option>
            </select>
          </div>

          {/* 알림 값 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {type === 'keyword'
                ? '키워드'
                : type === 'source'
                ? '매체'
                : '카테고리'}
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={
                type === 'keyword'
                  ? '예: 금리, 반도체'
                  : type === 'source'
                  ? '예: Bloomberg'
                  : '예: 마켓'
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* 알림 방법 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              알림 방법
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="email">이메일</option>
              <option value="push">웹 푸시</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            추가
          </button>
        </div>
      </form>
    </div>
  );
}