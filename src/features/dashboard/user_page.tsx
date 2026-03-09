"use client"

import React, { useEffect, useState } from 'react';
import { 
  ShoppingCart, 
  CalendarDays,
  DollarSign,
  Package,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { getUserDashboardStats } from '@/app/dashboard/actions';

interface UserDashboardStats {
  dailySalesCount: number;
  dailySalesRevenue: number;
  monthlySalesCount: number;
  monthlySalesRevenue: number;
  totalOrders: number;
  totalSpentAmount: number;
  recentOrders: {
    id: number;
    totalAmount: number;
    createdAt: string;
    itemCount: number;
    items: { productName: string; quantity: number; price: number }[];
  }[];
  lowStockProducts: {
    id: number;
    name: string;
    stock: number;
    category: string;
  }[];
}

interface UserPageProps {
  userId?: string;
}

const UserPage = ({ userId }: UserPageProps) => {
  const [stats, setStats] = useState<UserDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      const res = await getUserDashboardStats(userId || "");
      if (res.success && res.stats) {
        setStats(res.stats);
      }
      setLoading(false);
    }
    fetchStats();
  }, [userId]);

  const cards = stats ? [
    {
      title: "Daily Orders",
      value: stats.dailySalesCount.toString(),
      subtitle: `$${stats.dailySalesRevenue.toLocaleString()} today`,
      icon: CalendarDays,
      color: "blue",
    },
    {
      title: "Monthly Orders",
      value: stats.monthlySalesCount.toString(),
      subtitle: `$${stats.monthlySalesRevenue.toLocaleString()} this month`,
      icon: ShoppingCart,
      color: "indigo",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toString(),
      subtitle: `$${stats.totalSpentAmount.toLocaleString()} total spent`,
      icon: DollarSign,
      color: "green",
    },
    {
      title: "Low Stock Alerts",
      value: stats.lowStockProducts.length.toString(),
      subtitle: "Products below 10 units",
      icon: AlertTriangle,
      color: "red",
    },
  ] : [];

  const colorMap: Record<string, { text: string; iconBg: string }> = {
    blue:   { text: "text-blue-600",   iconBg: "bg-blue-100" },
    indigo: { text: "text-indigo-600", iconBg: "bg-indigo-100" },
    green:  { text: "text-green-600",  iconBg: "bg-green-100" },
    red:    { text: "text-red-600",    iconBg: "bg-red-100" },
  };

  return (
    <div className="p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">User Dashboard</h1>
          <p className="text-gray-500 mt-1">Your sales activity and inventory alerts.</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500 font-medium">Loading your dashboard...</div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {cards.map((card, index) => {
                const Icon = card.icon;
                const colors = colorMap[card.color] || colorMap.blue;
                return (
                  <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${colors.iconBg} ${colors.text}`}>  
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-500">{card.title}</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">{card.value}</h3>
                        <p className="text-sm text-gray-400 mt-1">{card.subtitle}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

              {/* Recent Orders Table */}
              <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-lg font-bold text-gray-900">My Recent Orders</h2>
                  <span className="text-sm text-gray-500">{stats?.recentOrders.length || 0} orders</span>
                </div>
                <div className="overflow-x-auto">
                  {stats && stats.recentOrders.length > 0 ? (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50/50">
                          <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                          <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Items</th>
                          <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {stats.recentOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-4 px-6 text-sm font-bold text-gray-900">#{order.id}</td>
                            <td className="py-4 px-6 text-sm text-gray-600">{order.itemCount} item{order.itemCount !== 1 ? 's' : ''}</td>
                            <td className="py-4 px-6 text-sm font-semibold text-gray-900">${order.totalAmount.toLocaleString()}</td>
                            <td className="py-4 px-6 text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-6 text-center text-gray-400">
                      <ShoppingCart className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                      <p className="font-medium">No orders yet</p>
                      <p className="text-sm mt-1">Your orders will appear here</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Low Stock Alerts */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <h2 className="text-lg font-bold text-gray-900">Low Stock Alerts</h2>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Products running low on inventory</p>
                </div>
                <div className="p-4">
                  {stats && stats.lowStockProducts.length > 0 ? (
                    <div className="space-y-3">
                      {stats.lowStockProducts.map((product) => (
                        <div key={product.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-red-100 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                              <Package className="w-5 h-5 text-red-500" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">{product.name}</p>
                              <p className="text-xs text-gray-500">{product.category}</p>
                            </div>
                          </div>
                          <span className={`text-sm font-bold px-2.5 py-1 rounded-full ${
                            product.stock <= 3 
                              ? 'bg-red-100 text-red-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {product.stock} left
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-gray-400">
                      <Package className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                      <p className="font-medium">All stocked up!</p>
                      <p className="text-sm mt-1">No products below 10 units</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserPage;