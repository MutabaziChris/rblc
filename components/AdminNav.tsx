'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Wrench,
  HelpCircle,
  BarChart3,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { useState } from 'react';

interface AdminNavProps {
  user: User;
}

export default function AdminNav({ user }: AdminNavProps) {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  const navLinks = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/suppliers', label: 'Suppliers', icon: Users },
    { href: '/admin/mechanics', label: 'Mechanics', icon: Wrench },
    { href: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <nav className="flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary-600 transition-colors"
                >
                  <Icon size={18} className="mr-2" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm font-medium text-gray-700">
                {user.email}
              </span>
              <ChevronDown size={16} className="text-gray-500" />
            </button>

            {showDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowDropdown(false)}
                />
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-20">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.email}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} className="mr-2" />
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
