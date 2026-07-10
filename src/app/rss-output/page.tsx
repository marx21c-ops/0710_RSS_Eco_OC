'use client';

import { useState } from 'react';
import RSSGenerator from '@/components/rss/RSSGenerator';

export default function RSSOutputPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">RSS 출력</h1>
        <p className="text-gray-600">
          맞춤형 RSS 피드를 생성하여 외부 RSS 리더에서 구독하세요
        </p>
      </div>

      <RSSGenerator />
    </div>
  );
}