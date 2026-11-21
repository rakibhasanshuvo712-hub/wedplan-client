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
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-950">
              My Wedding Bookings
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Review and manage your requested wedding services and dates.
            </p>
          </div>
          <Link href="/services">
            <Button variant="outline" size="sm">
              <Search className="w-3.5 h-3.5 mr-1.5" />
              Browse More Services
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-36 w-full rounded-3xl" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-rose-100 p-8 max-w-md mx-auto">
            <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-serif font-bold text-gray-900 mb-1">
              No Bookings Yet
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              You haven't requested any wedding services. Explore venues, photographers, and caterers to begin!
            </p>
            <Link href="/services">
              <Button variant="primary">Explore Wedding Services</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-3xl p-6 border border-rose-100/80 shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Service Details */}
                <div className="flex items-start sm:items-center gap-4">
                  <img
                    src={booking.serviceId?.images?.[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80'}
                    alt={booking.serviceId?.serviceName}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-rose-100 shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                        {booking.serviceId?.category}
                      </span>
                      <span className="text-xs text-gray-400">
                        Requested on {formatDate(booking.createdAt)}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-base sm:text-lg text-gray-950">
                      {booking.serviceId?.serviceName}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                      <span className="flex items-center gap-1 font-semibold text-rose-600">
                        <Calendar className="w-3.5 h-3.5 text-rose-500" />
                        Event Date: {formatDate(booking.eventDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        {booking.eventLocation}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-gray-400" />
                      Vendor: <strong>{booking.vendorId?.businessName || booking.vendorId?.name}</strong>
                    </p>
                  </div>
                </div>

                {/* Status and Action */}
                <div className="flex md:flex-col items-center md:items-end justify-between pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 gap-3 shrink-0">
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        booking.status === 'accepted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : booking.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : booking.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {booking.status === 'accepted' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {booking.status === 'pending' && <Clock className="w-3.5 h-3.5" />}
                      {booking.status === 'rejected' && <XCircle className="w-3.5 h-3.5" />}
                      {booking.status}
                    </span>
                    <p className="text-sm font-serif font-bold text-gray-900 mt-1">
                      {booking.serviceId?.price ? formatCurrency(booking.serviceId.price) : ''}
                    </p>
                  </div>

                  {booking.status === 'accepted' && (
                    (booking as { paymentStatus?: string }).paymentStatus === 'paid' ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Paid via Stripe
                      </span>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-xs"
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
