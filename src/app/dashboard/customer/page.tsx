'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { RoleGuard } from '@/components/common/RoleGuard';
import { Booking } from '@/types';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
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
        <div className="bg-gradient-to-r from-rose-600 via-rose-500 to-pink-500 rounded-3xl p-8 text-white shadow-lg shadow-rose-500/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
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
          <Card className="border-rose-100">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Total Inquiries</p>
                <h3 className="text-2xl font-serif font-bold text-gray-900 mt-0.5">
                  {loading ? <Skeleton className="h-7 w-12" /> : total}
                </h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-100">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Pending Review</p>
                <h3 className="text-2xl font-serif font-bold text-gray-900 mt-0.5">
                  {loading ? <Skeleton className="h-7 w-12" /> : pending}
                </h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-100">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Accepted Bookings</p>
                <h3 className="text-2xl font-serif font-bold text-gray-900 mt-0.5">
                  {loading ? <Skeleton className="h-7 w-12" /> : accepted}
                </h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-100">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Rejected / Cancelled</p>
                <h3 className="text-2xl font-serif font-bold text-gray-900 mt-0.5">
                  {loading ? <Skeleton className="h-7 w-12" /> : rejected}
                </h3>
              </div>
            </CardContent>
          </Card>
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
