'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { RoleGuard } from '@/components/common/RoleGuard';
import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
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
        <div className="bg-gradient-to-r from-gray-900 via-rose-950 to-black rounded-3xl p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-300 bg-rose-900/60 px-3 py-1 rounded-full border border-rose-700/60">
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
              <Button className="bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-sm">
                <FileCheck2 className="w-4 h-4 mr-1.5" />
                Review Pending Services
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-gray-200">
            <CardContent className="p-5 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 font-medium">Total Registered Users</p>
                <h3 className="text-2xl font-serif font-bold text-gray-900 mt-0.5">
                  {loading ? <Skeleton className="h-7 w-12" /> : stats?.totalUsers || 0}
                </h3>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {stats?.totalVendors || 0} Vendors • {stats?.totalCustomers || 0} Couples
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-5 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 font-medium">Published Services</p>
                <h3 className="text-2xl font-serif font-bold text-gray-900 mt-0.5">
                  {loading ? <Skeleton className="h-7 w-12" /> : stats?.totalServices || 0}
                </h3>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {stats?.approvedServices || 0} Approved
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-amber-50/20">
            <CardContent className="p-5 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-amber-800 font-bold uppercase tracking-wider">
                  Pending Approvals
                </p>
                <h3 className="text-2xl font-serif font-bold text-amber-900 mt-0.5">
                  {loading ? <Skeleton className="h-7 w-12" /> : stats?.pendingServices || 0}
                </h3>
                <p className="text-[10px] text-amber-700 mt-0.5">Awaiting admin review</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 bg-emerald-50/20">
            <CardContent className="p-5 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-emerald-800 font-bold uppercase tracking-wider">
                  Platform Revenue
                </p>
                <h3 className="text-2xl font-serif font-bold text-emerald-900 mt-0.5">
                  {loading ? <Skeleton className="h-7 w-20" /> : formatCurrency(stats?.totalRevenue || 0)}
                </h3>
                <p className="text-[10px] text-emerald-700 mt-0.5">
                  {stats?.totalTransactions || 0} Verified Stripe Sessions
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Two-Column Split: Recent Users & Recent Services */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Users */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-serif font-bold text-gray-900 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-rose-600" />
                Recent User Registrations
              </h2>
              <Link
                href="/dashboard/admin/users"
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
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
                <FileCheck2 className="w-4 h-4 text-rose-600" />
                Recent Service Submissions
              </h2>
              <Link
                href="/dashboard/admin/services"
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
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
