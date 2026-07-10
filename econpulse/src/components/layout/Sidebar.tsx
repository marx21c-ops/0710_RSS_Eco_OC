'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { name: '전체 뉴스', href: '/', icon: '📰' },
  { name: '한국 뉴스', href: '/?source=korean', icon: '🇰🇷' },
  { name: '해외 뉴스', href: '/?source=foreign', icon: '🌍' },
  { name: '경제일반', href: '/?category=경제일반', icon: '💰' },
  { name: '마켓', href: '/?category=마켓', icon: '📈' },
  { name: '비즈니스', href: '/?category=비즈니스', icon: '💼' },
  { name: '기술', href: '/?category=기술', icon: '💻' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="p-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
          카테고리
        </h2>
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            도구
          </h2>
          <ul className="space-y-2">
            <li>
              <Link
                href="/rss-output"
                className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                <span className="mr-3">📡</span>
                RSS 출력
              </Link>
            </li>
            <li>
              <Link
                href="/api/cron"
                className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                <span className="mr-3">🔄</span>
                수집 상태
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
}