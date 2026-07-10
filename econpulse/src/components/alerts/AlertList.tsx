'use client';

interface Alert {
  id: string;
  type: string;
  value: string;
  method: string;
  active: boolean;
  lastSent?: string;
  createdAt: string;
}

interface AlertListProps {
  alerts: Alert[];
  onDelete: (id: string) => void;
  onToggle: (id: string, active: boolean) => void;
}

export default function AlertList({ alerts, onDelete, onToggle }: AlertListProps) {
  if (alerts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">설정된 알림이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`bg-white rounded-lg shadow-sm border p-4 ${
            alert.active ? 'border-gray-200' : 'border-gray-100 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <span className="text-sm font-medium text-gray-500">
                  {alert.type === 'keyword'
                    ? '키워드'
                    : alert.type === 'source'
                    ? '매체'
                    : '카테고리'}
                </span>
                <p className="text-lg font-semibold text-gray-900">
                  {alert.value}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">
                  {alert.method === 'email' ? '이메일' : '웹 푸시'}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* 토글 스위치 */}
              <button
                onClick={() => onToggle(alert.id, !alert.active)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  alert.active ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    alert.active ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>

              {/* 삭제 버튼 */}
              <button
                onClick={() => onDelete(alert.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {alert.lastSent && (
            <p className="text-xs text-gray-500 mt-2">
              마지막 알림: {new Date(alert.lastSent).toLocaleString('ko-KR')}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}