"use client"

import React, { useEffect, useState } from 'react';
import { 
  DollarSign, 
  ShoppingCart, 
  TrendingUp,
  TrendingDown,
  CalendarDays,
  ArrowUpRight,
  ArrowDownRight,
  Trophy,
  AlertTriangle
} from 'lucide-react';
import { getDashboardStats } from '@/app/admin/dashboard/actions';

interface DashboardStats {
  dailySalesCount: number;
  dailySalesRevenue: number;
  monthlySalesCount: number;
  monthlySalesRevenue: number;
  totalRevenue: number;
  bestSellingProduct: { name: string; totalSold: number };
  lowSellingProduct: { name: string; totalSold: number };
}

const AdminPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      const res = await getDashboardStats();
      if (res.success && res.stats) {
        setStats(res.stats);
      }
      setLoading(false);
    }
    fetchStats();
  }, []);

  const cards = stats ? [
    {
      title: "Daily Sales",
      value: stats.dailySalesCount.toString(),
      subtitle: `$${stats.dailySalesRevenue.toLocaleString()} revenue`,
      icon: CalendarDays,
      color: "blue",
    },
    {
      title: "Monthly Sales",
      value: stats.monthlySalesCount.toString(),
      subtitle: `$${stats.monthlySalesRevenue.toLocaleString()} revenue`,
      icon: ShoppingCart,
      color: "indigo",
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      subtitle: "All time",
      icon: DollarSign,
      color: "green",
    },
    {
      title: "Best Selling Product",
      value: stats.bestSellingProduct.name,
      subtitle: `${stats.bestSellingProduct.totalSold} units sold`,
      icon: Trophy,
      color: "amber",
    },
    {
      title: "Low Selling Product",
      value: stats.lowSellingProduct.name,
      subtitle: `${stats.lowSellingProduct.totalSold} units sold`,
      icon: AlertTriangle,
      color: "red",
    },
  ] : [];

  const colorMap: Record<string, { bg: string; text: string; iconBg: string }> = {
    blue:   { bg: "bg-blue-50",   text: "text-blue-600",   iconBg: "bg-blue-100" },
    indigo: { bg: "bg-indigo-50", text: "text-indigo-600", iconBg: "bg-indigo-100" },
    green:  { bg: "bg-green-50",  text: "text-green-600",  iconBg: "bg-green-100" },
    amber:  { bg: "bg-amber-50",  text: "text-amber-600",  iconBg: "bg-amber-100" },
    red:    { bg: "bg-red-50",    text: "text-red-600",    iconBg: "bg-red-100" },
  };

  return (
    <div className="p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Real-time sales metrics from your database.</p>
          </div>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-500 font-medium">Loading dashboard stats...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
                      <h3 className="text-2xl font-bold text-gray-900 mt-1 truncate">{card.value}</h3>
                      <p className="text-sm text-gray-400 mt-1">{card.subtitle}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;