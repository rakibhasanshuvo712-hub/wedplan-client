'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { RoleGuard } from '@/components/common/RoleGuard';
import {
  LayoutDashboard,
  CalendarCheck,
  Building2,
  PlusCircle,
  CreditCard,
  Users,
  Settings,
  LogOut,
  Sparkles,
  Menu,
  X,
  FileCheck2,
  DollarSign,
  Heart,
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
        </div>
      }
    >
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </React.Suspense>
  );
}

function DashboardLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    return <RoleGuard>{children}</RoleGuard>;
  }

  // Define sidebar navigation items based on role
  let navItems: { name: string; href: string; icon: any }[] = [];

  if (user.role === 'customer') {
    navItems = [
      { name: 'Overview', href: '/dashboard/customer', icon: LayoutDashboard },
      { name: 'My Bookings', href: '/dashboard/customer/bookings', icon: CalendarCheck },
      { name: 'Profile Settings', href: '/dashboard/profile', icon: Settings },
    ];
  } else if (user.role === 'vendor') {
    navItems = [
      { name: 'Overview', href: '/dashboard/vendor', icon: LayoutDashboard },
      { name: 'My Services', href: '/dashboard/vendor/services', icon: Building2 },
      { name: 'Add Service', href: '/dashboard/vendor/add-service', icon: PlusCircle },
      { name: 'Booking Requests', href: '/dashboard/vendor/bookings', icon: CalendarCheck },
      { name: 'Subscription Plan', href: '/dashboard/vendor/subscription', icon: CreditCard },
      { name: 'Profile Settings', href: '/dashboard/profile', icon: Settings },
    ];
  } else if (user.role === 'admin') {
    navItems = [
      { name: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
      { name: 'Manage Users', href: '/dashboard/admin/users', icon: Users },
      { name: 'Manage Services', href: '/dashboard/admin/services', icon: FileCheck2 },
      { name: 'Transactions', href: '/dashboard/admin/transactions', icon: DollarSign },
      { name: 'Profile Settings', href: '/dashboard/profile', icon: Settings },
    ];
  }

  return (
    <RoleGuard>
      <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
        {/* Mobile Header Bar for Dashboard */}
        <div className="md:hidden bg-white border-b border-rose-100 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold text-xs">
              WP
            </div>
            <span className="font-serif font-bold text-gray-900 capitalize">
              {user.role} Dashboard
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl text-gray-600 hover:bg-rose-50"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Dashboard Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-rose-100/80 p-5 flex flex-col justify-between transition-transform duration-200 md:static md:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="space-y-6">
            {/* User Profile Mini Badge */}
            <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100/70 flex items-center gap-3">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border border-rose-200 shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-gray-900 truncate">{user.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[10px] uppercase font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">
                    {user.role}
                  </span>
                  {user.role === 'vendor' && user.subscriptionPlan === 'premium' && (
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />
                  )}
                </div>
              </div>
            </div>

            {/* Navigation links */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-rose-600 text-white shadow-xs shadow-rose-600/30'
                        : 'text-gray-600 hover:bg-rose-50 hover:text-rose-600'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Logout */}
          <div className="pt-4 border-t border-gray-100 space-y-2">
            <Link
              href="/"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50"
            >
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Back to Public Site</span>
            </Link>
            <button
              onClick={() => logout()}
              className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left"
            >
              <LogOut className="w-4 h-4 text-red-500" />
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </RoleGuard>
  );
}
