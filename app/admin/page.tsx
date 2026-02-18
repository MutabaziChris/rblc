import { Suspense } from 'react';
import DashboardCard from '@/components/DashboardCard';
import { supabase } from '@/lib/supabaseClient';
import { Order } from '@/types';
import {
  ShoppingCart,
  Users,
  TrendingUp,
  AlertCircle,
  Package,
  Wrench,
  HelpCircle,
} from 'lucide-react';
import Link from 'next/link';

// Force dynamic rendering so admin dashboard always shows latest data
export const dynamic = 'force-dynamic';

async function getStats() {
  const [ordersResult, suppliersResult, mechanicsResult, productsResult] = await Promise.all([
    supabase.from('orders').select('id, status, total_amount'),
    supabase.from('suppliers').select('id'),
    supabase.from('mechanics').select('id'),
    supabase.from('products').select('id, stock_status'),
  ]);

  const orders = ordersResult.data || [];
  const suppliers = suppliersResult.data || [];
  const mechanics = mechanicsResult.data || [];
  const products = productsResult.data || [];

  const totalRevenue = orders
    .filter((o) => o.total_amount)
    .reduce((sum, o) => sum + (o.total_amount || 0), 0);

  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const lowStockProducts = products.filter((p) => p.stock_status === 'low_stock').length;

  return {
    totalOrders: orders.length,
    totalRevenue,
    pendingOrders,
    suppliers: suppliers.length,
    mechanics: mechanics.length,
    products: products.length,
    lowStockProducts,
  };
}

async function getRecentOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }

  return data || [];
}

export default async function AdminDashboard() {
  const stats = await getStats();
  const recentOrders = await getRecentOrders();

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-primary-100 text-primary-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of your marketplace operations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={ShoppingCart}
            change={{ value: 12, isPositive: true }}
          />
          <DashboardCard
            title="Total Revenue"
            value={`RWF ${stats.totalRevenue.toLocaleString()}`}
            icon={TrendingUp}
            change={{ value: 8, isPositive: true }}
          />
          <DashboardCard
            title="Pending Orders"
            value={stats.pendingOrders}
            icon={AlertCircle}
            subtitle="Require attention"
          />
          <DashboardCard
            title="Low Stock Items"
            value={stats.lowStockProducts}
            icon={Package}
            subtitle="Need restocking"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/admin/orders"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <ShoppingCart className="text-primary-600 mb-4" size={32} />
            <h3 className="font-semibold text-lg mb-2">Manage Orders</h3>
            <p className="text-gray-600 text-sm">View and process customer orders</p>
          </Link>

          <Link
            href="/admin/suppliers"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <Users className="text-primary-600 mb-4" size={32} />
            <h3 className="font-semibold text-lg mb-2">Manage Suppliers</h3>
            <p className="text-gray-600 text-sm">View and manage supplier network</p>
          </Link>

          <Link
            href="/admin/mechanics"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <Wrench className="text-primary-600 mb-4" size={32} />
            <h3 className="font-semibold text-lg mb-2">Manage Mechanics</h3>
            <p className="text-gray-600 text-sm">View and manage mechanic network</p>
          </Link>

          <Link
            href="/admin/products"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <Package className="text-primary-600 mb-4" size={32} />
            <h3 className="font-semibold text-lg mb-2">Manage Products</h3>
            <p className="text-gray-600 text-sm">Add, edit, and delete products</p>
          </Link>

          <Link
            href="/admin/faqs"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <HelpCircle className="text-primary-600 mb-4" size={32} />
            <h3 className="font-semibold text-lg mb-2">Manage FAQs</h3>
            <p className="text-gray-600 text-sm">Manage frequently asked questions</p>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              View All →
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Part Requested
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-mono">{order.id.slice(0, 8)}...</td>
                      <td className="px-4 py-3 text-sm">
                        {order.customer_name || order.customer_phone}
                      </td>
                      <td className="px-4 py-3 text-sm">{order.requested_part}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            statusColors[order.status]
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {order.total_amount
                          ? `RWF ${order.total_amount.toLocaleString()}`
                          : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {order.created_at
                          ? new Date(order.created_at).toLocaleDateString()
                          : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
