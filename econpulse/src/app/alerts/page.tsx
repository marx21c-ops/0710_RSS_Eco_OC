'use client';

import { useState, useEffect } from 'react';
import AlertForm from '@/components/alerts/AlertForm';
import AlertList from '@/components/alerts/AlertList';

interface Alert {
  id: string;
  type: string;
  value: string;
  method: string;
  active: boolean;
  lastSent?: string;
  createdAt: string;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await fetch('/api/alerts');
      const data = await response.json();
      setAlerts(data.alerts || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (newAlert: Omit<Alert, 'id' | 'createdAt' | 'lastSent'>) => {
    try {
      await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAlert),
      });
      await fetchAlerts();
      setShowForm(false);
    } catch (error) {
      console.error('Error creating alert:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/alerts/${id}`, { method: 'DELETE' });
      await fetchAlerts();
    } catch (error) {
      console.error('Error deleting alert:', error);
    }
  };

  const handleToggle = async (id: string, active: boolean) => {
    try {
      await fetch(`/api/alerts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active }),
      });
      await fetchAlerts();
    } catch (error) {
      console.error('Error toggling alert:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">알림 설정 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">알림 설정</h1>
          <p className="text-gray-600">키워드, 매체, 카테고리별 알림 설정</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          알림 추가
        </button>
      </div>

      {showForm && (
        <AlertForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      )}

      <AlertList
        alerts={alerts}
        onDelete={handleDelete}
        onToggle={handleToggle}
      />
    </div>
  );
}