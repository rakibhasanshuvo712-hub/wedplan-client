'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { RoleGuard } from '@/components/common/RoleGuard';
import { Service, Booking } from '@/types';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { StatCard } from '@/components/common/StatCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Building2,
  CheckCircle2,
  Clock,
  Sparkles,
  PlusCircle,
  CalendarCheck,
  CreditCard,
  ArrowRight,
} from 'lucide-react';

export default function VendorOverviewPage() {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const [servicesRes, bookingsRes] = await Promise.all([
          api.get('/services/vendor/my-services'),
          api.get('/bookings/vendor-requests'),
        ]);

        const servicesList = servicesRes?.services || servicesRes?.data || [];
        const bookingsList = bookingsRes?.bookings || bookingsRes?.data || [];
        setServices(servicesList);
        setBookings(bookingsList);
      } catch (err) {
        console.error('Failed to load vendor data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, []);

  const totalServices = services.length;
  const activeServices = services.filter((s) => s.isActive && s.status === 'approved').length;
  const pendingRequests = bookings.filter((b) => b.status === 'pending').length;
  const acceptedBookings = bookings.filter((b) => b.status === 'accepted').length;
  const isPremium = user?.subscriptionPlan === 'premium';

  return (
    <RoleGuard allowedRoles={['vendor']}>
      <div className="space-y-8">
        {/* Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-red-700 via-red-600 to-red-600 rounded-3xl p-8 text-white shadow-xl shadow-red-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="aurora-orb absolute -top-20 right-16 w-64 h-64 bg-amber-300/25" />
          <div className="relative">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-red-100 bg-white/20 px-3 py-1 rounded-full">
                Vendor Studio
              </span>
              {isPremium && (
                <span className="text-xs font-bold uppercase tracking-wider bg-amber-400 text-amber-950 px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 fill-current" /> Premium Tier
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold mt-2">
              {user?.businessName || user?.name}
            </h1>
            <p className="text-xs sm:text-sm text-red-100 mt-1 max-w-xl">
              Manage your wedding service portfolio, review customer event dates, and track your business growth.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {!isPremium && activeServices >= 3 ? (
              <Link href="/dashboard/vendor/subscription">
                <Button className="bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold shadow-md">
                  <Sparkles className="w-4 h-4 mr-1.5 fill-current" />
                  Upgrade to Add More Services
                </Button>
              </Link>
            ) : (
              <Link href="/dashboard/vendor/add-service">
                <Button variant="outline" className="bg-white text-red-700 hover:bg-red-50 border-none shadow-sm font-semibold">
                  <PlusCircle className="w-4 h-4 mr-1.5" />
                  Add New Service
                </Button>
              </Link>
            )}
            {!isPremium && activeServices < 3 && (
              <Link href="/dashboard/vendor/subscription">
                <Button className="bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-md">
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  Upgrade to Premium
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Limit Warning Banner if 3/3 reached */}
        {!isPremium && !loading && activeServices >= 3 && (
          <div className="p-5 rounded-3xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-in fade-in duration-200">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0 text-amber-600">
                <Sparkles className="w-6 h-6 fill-amber-400" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-amber-950">
                  Free Starter Limit Reached (3 of 3 Active Services)
                </h4>
                <p className="text-xs text-amber-800 mt-0.5 max-w-xl">
                  You are currently using all 3 service slots allowed on the Free Plan. Upgrade to WedPlan Premium for $49/year to publish unlimited services, get verified, and receive priority placement.
                </p>
              </div>
            </div>
            <Link href="/dashboard/vendor/subscription" className="shrink-0 w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white font-bold text-xs shadow-md shadow-red-500/10 px-6 py-2.5">
                <Sparkles className="w-3.5 h-3.5 mr-1.5 fill-current" />
                Upgrade to Premium ($49/yr)
              </Button>
            </Link>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            label="Total Listings"
            value={totalServices}
            icon={Building2}
            iconGradient="from-red-500 to-red-600"
            cardGradient="from-red-50 to-red-50/50"
            border="border-red-200/70"
            text="text-red-700"
            bar="from-red-500 via-red-500 to-red-500"
            loading={loading}
          />
          <StatCard
            label="Active & Approved"
            value={activeServices}
            icon={CheckCircle2}
            iconGradient="from-emerald-500 to-teal-600"
            cardGradient="from-emerald-50 to-teal-50/50"
            border="border-emerald-200/70"
            text="text-emerald-700"
            bar="from-emerald-500 via-teal-400 to-cyan-400"
            loading={loading}
          />
          <StatCard
            label="Pending Inquiries"
            value={pendingRequests}
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
            value={acceptedBookings}
            icon={CalendarCheck}
            iconGradient="from-blue-500 to-indigo-600"
            cardGradient="from-sky-50 to-blue-50/50"
            border="border-blue-200/70"
            text="text-blue-700"
            bar="from-sky-500 via-blue-500 to-indigo-500"
            loading={loading}
          />
          <StatCard
            label="Plan Status"
            value={isPremium ? '★ Premium' : 'Free Tier'}
            icon={CreditCard}
            iconGradient="from-violet-500 to-red-600"
            cardGradient="from-violet-50 to-red-50/50"
            border="border-violet-200/70"
            text="text-violet-700"
            bar="from-violet-500 via-red-500 to-red-500"
            subtext={isPremium ? 'Unlimited services' : 'Max 3 active services'}
            loading={loading}
          />
        </div>

        {/* Free Tier Warning Banner if at limit */}
        {!isPremium && activeServices >= 3 && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-900 text-xs">
            <div>
              <p className="font-bold">Free Plan Limit Reached (3 / 3 active services)</p>
              <p className="text-amber-700 mt-0.5">Upgrade to Premium for unlimited active services, higher placement, and verified badge.</p>
            </div>
            <Link href="/dashboard/vendor/subscription">
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white shrink-0">
                Upgrade for $49/yr
              </Button>
            </Link>
          </div>
        )}

        {/* Quick Sections: Recent Booking Requests */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-red-100 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-serif font-bold text-gray-900">
              Recent Booking Inquiries
            </h2>
            <Link
              href="/dashboard/vendor/bookings"
              className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              Manage Inquiries <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-2xl" />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-10 text-gray-500 text-xs">
              No customer booking requests yet. They will appear here when couples request your services.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {bookings.slice(0, 3).map((b) => (
                <div key={b._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900">
                      Customer: {b.customerId?.name} ({b.customerId?.email})
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Service: <strong>{b.serviceId?.serviceName}</strong> • Date: {formatDate(b.eventDate)} • Location: {b.eventLocation}
                    </p>
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
