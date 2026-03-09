"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { LayoutDashboard, Package, Tag, ShoppingCart, ShoppingBag } from 'lucide-react';

const DashboardNavBar = () => {
  const pathname = usePathname() || '';
  const { data: session } = useSession();
  const role = (session?.user as any)?.role || '';

  // Admin sees all links; regular users see only Orders
  const adminLinks = [
    { name: 'Inventory', path: '/inventory', icon: Package },
    { name: 'Products', path: '/Product_frontend', icon: ShoppingBag },
    { name: 'Categories', path: '/categories_frontend', icon: Tag },
    { name: 'Orders', path: '/orders', icon: ShoppingCart },
  ];

  const userLinks = [
    { name: 'Orders', path: '/orders', icon: ShoppingCart },
  ];

  const navLinks = role === 'ADMIN' ? adminLinks : userLinks;

  // Determine if it's admin or user context to show the correct dashboard link
  const isAdmin = pathname.includes('/admin');
  const dashboardLink = isAdmin ? '/admin/dashboard' : '/dashboard';

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold tracking-tight text-blue-600">SalesPro</span>
            </div>
            <div className="hidden sm:-my-px sm:ml-8 sm:flex sm:space-x-8">
              <Link
                href={dashboardLink}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === dashboardLink
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className="sm:hidden border-t border-gray-200 pt-2 pb-3 space-y-1">
        <Link
          href={dashboardLink}
          className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
            pathname === dashboardLink
              ? 'bg-blue-50 border-blue-500 text-blue-700'
              : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
          }`}
        >
          <div className="flex items-center">
             <LayoutDashboard className="w-5 h-5 mr-3 text-gray-400" />
             Dashboard
          </div>
        </Link>
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.path);
          return (
             <Link
                key={item.name}
                href={item.path}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                }`}
              >
               <div className="flex items-center">
                 <Icon className="w-5 h-5 mr-3 text-gray-400" />
                 {item.name}
               </div>
             </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default DashboardNavBar;
