'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { BarChart3, Users, TrendingUp, Globe } from 'lucide-react';

interface AnalyticsData {
  totalVisitors: number;
  visitorsToday: number;
  visitorsThisWeek: number;
  chartData: { date: string; visitors: number }[];
  mostVisitedPages: { page: string; count: number }[];
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/analytics');
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className="min-h-screen py-8 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="animate-spin mx-auto mb-4 text-primary-600" size={48} />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen py-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'No data'}</p>
          <button
            onClick={fetchAnalytics}
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Visitor Analytics</h1>
          <p className="text-gray-600">Track page visits and popular content</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Visitors</p>
                <p className="text-2xl font-bold text-gray-900">{data.totalVisitors}</p>
              </div>
              <Users className="text-primary-600" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Today</p>
                <p className="text-2xl font-bold text-gray-900">{data.visitorsToday}</p>
              </div>
              <Globe className="text-primary-600" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">This Week</p>
                <p className="text-2xl font-bold text-gray-900">{data.visitorsThisWeek}</p>
              </div>
              <TrendingUp className="text-primary-600" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Top Pages</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.mostVisitedPages.length}
                </p>
              </div>
              <BarChart3 className="text-primary-600" size={32} />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Visits over last 7 days */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">Visits (Last 7 Days)</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v) => v.slice(5)}
                  />
                  <YAxis allowDecimals={false} />
                  <Tooltip
                    formatter={(value: number) => [value, 'Visits']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="visitors"
                    stroke="#00a8f3"
                    strokeWidth={2}
                    dot={{ fill: '#00a8f3' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Most visited pages */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">Most Visited Pages</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.mostVisitedPages.slice(0, 8)}
                  layout="vertical"
                  margin={{ left: 20, right: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis
                    type="category"
                    dataKey="page"
                    width={120}
                    tick={{ fontSize: 10 }}
                    tickFormatter={(v) => {
                      try {
                        const u = new URL(v);
                        return u.pathname || v;
                      } catch {
                        return v.length > 25 ? v.slice(0, 22) + '...' : v;
                      }
                    }}
                  />
                  <Tooltip
                    formatter={(value: number) => [value, 'Visits']}
                    labelFormatter={(label) => `Page: ${label}`}
                  />
                  <Bar dataKey="count" fill="#00a8f3" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top pages table */}
        <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
          <h2 className="text-lg font-semibold p-4 border-b border-gray-100">
            Page Breakdown
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Page URL
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Visits
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.mostVisitedPages.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-4 py-8 text-center text-gray-500">
                      No visits recorded yet
                    </td>
                  </tr>
                ) : (
                  data.mostVisitedPages.map(({ page, count }) => (
                    <tr key={page} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700 truncate max-w-md">
                        {page}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-right">
                        {count}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
