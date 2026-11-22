'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { RoleGuard } from '@/components/common/RoleGuard';
import { Booking } from '@/types';
import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Building2,
  Search,
  CreditCard,
} from 'lucide-react';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/my-bookings');
      const list = res?.bookings || res?.data || [];
      setBookings(list);
    } catch (err: any) {
      toast.error('Failed to load your bookings: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handlePayBooking = async (bookingId: string) => {
    setPayingId(bookingId);
    try {
      const res = await api.post('/payments/create-booking-checkout-session', { bookingId });
      const checkoutUrl = res?.url || res?.data?.url;
      if (checkoutUrl) {
        toast.success('Redirecting to Stripe Checkout...');
        window.location.href = checkoutUrl;
      } else {
        toast.error('Failed to initiate Stripe payment session.');
        setPayingId(null);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Payment initiation failed.';
      toast.error(msg);
      setPayingId(null);
    }
  };

  const handleCancelBooking = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this pending booking request?')) return;

    setCancellingId(id);
    try {
      await api.put(`/bookings/${id}/cancel`);
      toast.success('Booking request cancelled successfully.');
      fetchBookings();
    } catch (err: any) {
      toast.error(err.message || 'Failed to cancel booking request.');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <RoleGuard allowedRoles={['customer']}>
      <div className="relative space-y-6">
        <div className="aurora-orb absolute -top-24 -left-28 w-80 h-80 bg-pink-300/30" />
        <div className="aurora-orb aurora-orb--slow absolute top-1/3 -right-28 w-72 h-72 bg-amber-300/25" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-rose-700 bg-gradient-to-r from-rose-100 via-pink-100 to-amber-100 border border-rose-200/70 px-3 py-1 rounded-full shadow-sm shadow-rose-500/10 mb-3">
              <Calendar className="w-3 h-3" /> Your Celebrations
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gradient-rose">
              My Wedding Bookings
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Review and manage your requested wedding services and dates.
            </p>
          </div>
          <Link href="/services">
            <Button variant="outline" size="sm" className="border-rose-200 text-rose-700 hover:text-white hover:bg-gradient-to-r hover:from-rose-500 hover:to-pink-600 hover:border-transparent font-bold transition-all">
              <Search className="w-3.5 h-3.5 mr-1.5" />
              Browse More Services
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-36 w-full rounded-3xl ring-1 ring-rose-100/70" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="relative overflow-hidden text-center py-20 bg-gradient-to-br from-white via-rose-50/70 to-amber-50/70 rounded-3xl border border-rose-200/70 p-8 max-w-md mx-auto shadow-lg shadow-rose-500/10">
            <div className="aurora-orb absolute -top-16 -left-16 w-48 h-48 bg-rose-300/30" />
            <div className="aurora-orb aurora-orb--slow absolute -bottom-16 -right-16 w-48 h-48 bg-amber-300/30" />
            <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 via-pink-500 to-amber-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-pink-500/25">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="relative z-10 text-lg font-serif font-bold text-gradient-rose mb-1">
              No Bookings Yet
            </h3>
            <p className="relative z-10 text-xs text-gray-600 mb-6">
              You haven't requested any wedding services. Explore venues, photographers, and caterers to begin!
            </p>
            <Link href="/services">
              <Button className="relative z-10 bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 hover:from-rose-700 hover:via-pink-700 hover:to-amber-600 text-white font-bold shadow-lg shadow-rose-500/25">Explore Wedding Services</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="group relative overflow-hidden bg-white rounded-3xl p-6 border border-rose-100/80 shadow-sm shadow-rose-500/5 hover:shadow-xl hover:shadow-fuchsia-500/10 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400" />
                <div className="aurora-orb absolute -bottom-20 -right-16 w-56 h-56 bg-amber-200/20 group-hover:bg-rose-200/30 transition-colors" />
                {/* Service Details */}
                <div className="relative z-10 flex items-start sm:items-center gap-4">
                  <img
                    src={booking.serviceId?.images?.[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80'}
                    alt={booking.serviceId?.serviceName}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-rose-200/80 shadow-md shadow-rose-500/10 shrink-0 bg-gradient-to-br from-rose-100 via-pink-100 to-amber-100"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-gradient-to-r from-rose-500 to-pink-600 px-2 py-0.5 rounded-full shadow-sm shadow-rose-500/20">
                        {booking.serviceId?.category}
                      </span>
                      <span className="text-xs text-gray-400">
                        Requested on {formatDate(booking.createdAt)}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-base sm:text-lg text-gray-950 group-hover:text-rose-700 transition-colors">
                      {booking.serviceId?.serviceName}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                      <span className="flex items-center gap-1 font-semibold text-rose-600">
                        <Calendar className="w-3.5 h-3.5 text-rose-500" />
                        Event Date: {formatDate(booking.eventDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-fuchsia-400" />
                        {booking.eventLocation}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-amber-500" />
                      Vendor: <strong className="text-rose-700">{booking.vendorId?.businessName || booking.vendorId?.name}</strong>
                    </p>
                  </div>
                </div>

                {/* Status and Action */}
                <div className="relative z-10 flex md:flex-col items-center md:items-end justify-between pt-4 md:pt-0 border-t md:border-t-0 border-rose-100/70 gap-3 shrink-0">
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${
                        booking.status === 'accepted'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200/80 shadow-emerald-500/10'
                          : booking.status === 'pending'
                          ? 'bg-amber-100 text-amber-800 border-amber-200/80 shadow-amber-500/10'
                          : booking.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800 border-rose-200/80 shadow-rose-500/10'
                          : 'bg-gray-100 text-gray-600 border-gray-200'
                      }`}
                    >
                      {booking.status === 'accepted' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {booking.status === 'pending' && <Clock className="w-3.5 h-3.5" />}
                      {booking.status === 'rejected' && <XCircle className="w-3.5 h-3.5" />}
                      {booking.status}
                    </span>
                    <p className="text-sm font-serif font-bold text-gradient-gold mt-1">
                      {booking.serviceId?.price ? formatCurrency(booking.serviceId.price) : ''}
                    </p>
                  </div>

                  {booking.status === 'accepted' && (
                    (booking as { paymentStatus?: string }).paymentStatus === 'paid' ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-emerald-100 via-teal-100 to-sky-100 text-emerald-800 border border-emerald-200/80 rounded-full text-xs font-bold shadow-sm shadow-emerald-500/15">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Paid via Stripe
                      </span>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 hover:from-emerald-700 hover:via-teal-700 hover:to-sky-700 text-white font-bold text-xs shadow-md shadow-emerald-500/25"
                        isLoading={payingId === booking._id}
                        onClick={() => handlePayBooking(booking._id)}
                      >
                        <CreditCard className="w-3.5 h-3.5 mr-1" />
                        Pay with Stripe
                      </Button>
                    )
                  )}

                  {booking.status === 'pending' && (
                    <Button
                      variant="danger"
                      size="sm"
                      className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:via-pink-600 hover:to-rose-700 text-white font-bold text-xs border border-transparent shadow-md shadow-rose-500/25"
                      isLoading={cancellingId === booking._id}
                      onClick={() => handleCancelBooking(booking._id)}
                    >
                      Cancel Request
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
