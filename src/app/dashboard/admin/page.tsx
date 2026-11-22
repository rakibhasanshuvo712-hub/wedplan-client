'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { RoleGuard } from '@/components/common/RoleGuard';
import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { StatCard } from '@/components/common/StatCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Users,
  Building2,
  FileCheck2,
  DollarSign,
  Clock,
  ShieldCheck,
  UserCheck,
  ArrowRight,
} from 'lucide-react';

export default function AdminOverviewPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminOverview = async () => {
      try {
        const res = await api.get('/admin/overview');
        const adminData = res?.data || res;
        if (adminData) {
          setData(adminData);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminOverview();
  }, []);

  const stats = data?.stats;

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="space-y-8">
        {/* Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-violet-950 via-red-950 to-slate-950 rounded-3xl p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="aurora-orb absolute -top-20 right-10 w-72 h-72 bg-red-500/25" />
          <div className="aurora-orb aurora-orb--slow absolute -bottom-24 left-1/3 w-72 h-72 bg-amber-500/20" />
          <div className="relative">
            <span className="text-xs font-semibold uppercase tracking-wider text-red-300 bg-red-900/60 px-3 py-1 rounded-full border border-red-700/60">
              Platform Administration
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold mt-2">
              WedPlan Governance Console
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-xl">
              Monitor registered users, review vendor service applications, audit financial transactions, and maintain platform integrity.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/dashboard/admin/services">
              <Button className="bg-red-600 hover:bg-red-700 text-white font-semibold shadow-sm">
                <FileCheck2 className="w-4 h-4 mr-1.5" />
                Review Pending Services
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Registered Users"
            value={stats?.totalUsers || 0}
            icon={Users}
            iconGradient="from-violet-500 to-purple-600"
            cardGradient="from-violet-50 to-red-50/50"
            border="border-violet-200/70"
            text="text-violet-700"
            bar="from-violet-500 via-purple-500 to-red-500"
            subtext={`${stats?.totalVendors || 0} Vendors • ${stats?.totalCustomers || 0} Couples`}
            loading={loading}
          />
          <StatCard
            label="Published Services"
            value={stats?.totalServices || 0}
            icon={Building2}
            iconGradient="from-sky-500 to-blue-600"
            cardGradient="from-sky-50 to-indigo-50/50"
            border="border-sky-200/70"
            text="text-sky-700"
            bar="from-sky-500 via-blue-500 to-indigo-500"
            subtext={`${stats?.approvedServices || 0} Approved`}
            loading={loading}
          />
          <StatCard
            label="Pending Approvals"
            value={stats?.pendingServices || 0}
            icon={Clock}
            iconGradient="from-amber-500 to-orange-600"
            cardGradient="from-amber-50 to-yellow-50/50"
            border="border-amber-200/70"
            text="text-amber-700"
            bar="from-amber-500 via-orange-400 to-yellow-400"
            subtext="Awaiting admin review"
            loading={loading}
          />
          <StatCard
            label="Platform Revenue"
            value={formatCurrency(stats?.totalRevenue || 0)}
            icon={DollarSign}
            iconGradient="from-emerald-500 to-teal-600"
            cardGradient="from-emerald-50 to-teal-50/50"
            border="border-emerald-200/70"
            text="text-emerald-700"
            bar="from-emerald-500 via-teal-400 to-cyan-400"
            subtext={`${stats?.totalTransactions || 0} Verified Stripe Sessions`}
            loading={loading}
          />
        </div>

        {/* Two-Column Split: Recent Users & Recent Services */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Users */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-serif font-bold text-gray-900 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-red-600" />
                Recent User Registrations
              </h2>
              <Link
                href="/dashboard/admin/users"
                className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                Manage All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-2xl" />
                ))}
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {data?.recentUsers?.map((u: any) => (
                  <div key={u._id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-gray-900">{u.name}</p>
                      <p className="text-gray-400">{u.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-gray-100 text-gray-700">
                        {u.role}
                      </span>
                      {u.isBlocked && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
                          Blocked
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Services */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-serif font-bold text-gray-900 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-red-600" />
                Recent Service Submissions
              </h2>
              <Link
                href="/dashboard/admin/services"
                className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                Review All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-2xl" />
                ))}
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {data?.recentServices?.map((s: any) => (
                  <div key={s._id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-gray-900 line-clamp-1">{s.serviceName}</p>
                      <p className="text-gray-400">{s.category} • {formatCurrency(s.price)}</p>
                    </div>
                    <div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          s.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : s.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {s.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
