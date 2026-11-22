'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { RoleGuard } from '@/components/common/RoleGuard';
import { Booking } from '@/types';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { StatCard } from '@/components/common/StatCard';
import { CalendarCheck, Clock, CheckCircle2, XCircle, Search, ArrowRight } from 'lucide-react';

export default function CustomerOverviewPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerBookings = async () => {
      try {
        const res = await api.get('/bookings/my-bookings');
        const list = res?.bookings || res?.data || [];
        setBookings(list);
      } catch (err) {
        console.error('Failed to load bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerBookings();
  }, []);

  const total = bookings.length;
  const pending = bookings.filter((b) => b.status === 'pending').length;
  const accepted = bookings.filter((b) => b.status === 'accepted').length;
  const rejected = bookings.filter((b) => b.status === 'rejected').length;

  return (
    <RoleGuard allowedRoles={['customer']}>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-600 rounded-3xl p-8 text-white shadow-lg shadow-rose-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="aurora-orb absolute -top-20 right-12 w-64 h-64 bg-amber-300/25" />
          <div className="relative">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-100 bg-white/20 px-3 py-1 rounded-full">
              Customer Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold mt-2">
              Hello, {user?.name}!
            </h1>
            <p className="text-xs sm:text-sm text-rose-100 mt-1 max-w-xl">
              Track your wedding service inquiries, communicate with verified vendors, and manage your celebration timeline.
            </p>
          </div>
          <Link href="/services">
            <Button variant="outline" className="bg-white text-rose-700 hover:bg-rose-50 border-none shrink-0 shadow-sm">
              <Search className="w-4 h-4 mr-1.5" />
              Explore More Services
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            label="Total Inquiries"
            value={total}
            icon={CalendarCheck}
            iconGradient="from-rose-500 to-pink-600"
            cardGradient="from-rose-50 to-pink-50/50"
            border="border-rose-200/70"
            text="text-rose-700"
            bar="from-rose-500 via-pink-500 to-fuchsia-500"
            loading={loading}
          />
          <StatCard
            label="Pending Review"
            value={pending}
            icon={Clock}
            iconGradient="from-amber-500 to-orange-600"
            cardGradient="from-amber-50 to-yellow-50/50"
            border="border-amber-200/70"
            text="text-amber-700"
            bar="from-amber-500 via-orange-400 to-yellow-400"
            loading={loading}
          />
          <StatCard
            label="Accepted Bookings"
            value={accepted}
            icon={CheckCircle2}
            iconGradient="from-emerald-500 to-teal-600"
            cardGradient="from-emerald-50 to-teal-50/50"
            border="border-emerald-200/70"
            text="text-emerald-700"
            bar="from-emerald-500 via-teal-400 to-cyan-400"
            loading={loading}
          />
          <StatCard
            label="Rejected / Cancelled"
            value={rejected}
            icon={XCircle}
            iconGradient="from-rose-500 to-red-600"
            cardGradient="from-red-50 to-rose-50/50"
            border="border-red-200/70"
            text="text-red-700"
            bar="from-red-500 via-rose-500 to-pink-500"
            loading={loading}
          />
        </div>

        {/* Recent Activity / Next Step */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-serif font-bold text-gray-900">
              Recent Booking Inquiries
            </h2>
            <Link
              href="/dashboard/customer/bookings"
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-2xl" />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-gray-500 mb-4">You have not submitted any booking requests yet.</p>
              <Link href="/services">
                <Button variant="primary">Browse Available Services</Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {bookings.slice(0, 3).map((b) => (
                <div key={b._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={b.serviceId?.images?.[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=150&q=80'}
                      alt={b.serviceId?.serviceName}
                      className="w-14 h-14 rounded-2xl object-cover border border-rose-100 shrink-0"
                    />
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900">{b.serviceId?.serviceName}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Vendor: {b.vendorId?.businessName || b.vendorId?.name} • Event Date: {formatDate(b.eventDate)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        b.status === 'accepted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </RoleGuard>
  );
}
