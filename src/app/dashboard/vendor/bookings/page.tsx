'use client';

import React, { useEffect, useState } from 'react';
import { RoleGuard } from '@/components/common/RoleGuard';
import { Booking } from '@/types';
import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Mail,
  User,
  MessageSquare,
} from 'lucide-react';

export default function VendorBookingRequestsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/bookings/vendor-requests');
      const list = res?.bookings || res?.data || [];
      setBookings(list);
    } catch (err: any) {
      toast.error('Failed to load booking requests: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleRespond = async (bookingId: string, action: 'accept' | 'reject') => {
    setProcessingId(bookingId);
    try {
      const res = await api.put(`/bookings/${bookingId}/respond`, { action });
      toast.success(res.message || `Booking request has been ${action}ed!`);
      fetchRequests();
    } catch (err: any) {
      toast.error(err.message || `Failed to ${action} booking request.`);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <RoleGuard allowedRoles={['vendor']}>
      <div className="relative space-y-6">
        <div className="aurora-orb absolute -top-24 -left-28 w-80 h-80 bg-rose-300/30" />
        <div className="aurora-orb aurora-orb--slow absolute top-1/4 -right-28 w-72 h-72 bg-sky-300/25" />
        <div>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-rose-700 bg-gradient-to-r from-rose-100 via-fuchsia-100 to-violet-100 border border-rose-200/70 px-3 py-1 rounded-full shadow-sm shadow-rose-500/10 mb-3">
            <Calendar className="w-3 h-3" /> Inquiry Inbox
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gradient-rose">
            Customer Booking Requests
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Review incoming event requests, lock your availability, and accept or reject inquiries.
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40 w-full rounded-3xl ring-1 ring-rose-100/70" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="relative overflow-hidden text-center py-20 bg-gradient-to-br from-white via-rose-50/70 to-sky-50/70 rounded-3xl border border-rose-200/70 p-8 max-w-md mx-auto shadow-lg shadow-rose-500/10">
            <div className="aurora-orb absolute -top-16 -left-16 w-48 h-48 bg-rose-300/30" />
            <div className="aurora-orb aurora-orb--slow absolute -bottom-16 -right-16 w-48 h-48 bg-sky-300/30" />
            <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 via-fuchsia-500 to-sky-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-fuchsia-500/25">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="relative z-10 text-lg font-serif font-bold text-gradient-rose mb-1">
              No Booking Requests Yet
            </h3>
            <p className="relative z-10 text-xs text-gray-600">
              When couples submit booking requests for your active wedding services, they will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="group relative overflow-hidden bg-white rounded-3xl p-6 sm:p-7 border border-rose-100/80 shadow-sm shadow-rose-500/5 hover:shadow-xl hover:shadow-fuchsia-500/10 transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-500 via-fuchsia-500 to-sky-400" />
                <div className="aurora-orb absolute -bottom-20 -right-16 w-56 h-56 bg-violet-200/20 group-hover:bg-sky-200/30 transition-colors" />
                {/* Details */}
                <div className="relative z-10 space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-gradient-to-r from-rose-500 to-fuchsia-600 px-2.5 py-0.5 rounded-full shadow-sm shadow-rose-500/20">
                      {booking.serviceId?.serviceName}
                    </span>
                    <span className="text-xs text-gray-400">
                      Received {formatDate(booking.createdAt)}
                    </span>
                  </div>

                  {/* Customer Information */}
                  <div className="flex items-center gap-3">
                    {booking.customerId?.image ? (
                      <img
                        src={booking.customerId.image}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover border-2 border-rose-200/80 shadow-sm shadow-rose-500/15"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 via-fuchsia-500 to-violet-500 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-fuchsia-500/20">
                        <User className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900">
                        {booking.customerId?.name}
                      </h4>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-fuchsia-400" />
                        {booking.customerId?.email}
                      </p>
                    </div>
                  </div>

                  {/* Event Specifics */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 bg-gradient-to-r from-rose-50/80 via-fuchsia-50/60 to-violet-50/60 p-3 rounded-2xl border border-rose-100/80">
                    <span className="flex items-center gap-1.5 font-semibold text-rose-700">
                      <Calendar className="w-4 h-4 text-rose-600" />
                      Event Date: {formatDate(booking.eventDate)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-fuchsia-500" />
                      Location: {booking.eventLocation}
                    </span>
                  </div>

                  {booking.message && (
                    <div className="text-xs text-gray-600 flex items-start gap-2 bg-gradient-to-r from-amber-50/60 to-rose-50/40 p-3 rounded-2xl border border-amber-100/70">
                      <MessageSquare className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <p className="italic leading-relaxed">"{booking.message}"</p>
                    </div>
                  )}
                </div>

                {/* Status & Actions */}
                <div className="relative z-10 flex lg:flex-col items-center lg:items-end justify-between pt-4 lg:pt-0 border-t lg:border-t-0 border-rose-100/70 gap-3 shrink-0">
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

                  {booking.status === 'pending' ? (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="primary"
                        className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-700 hover:via-teal-700 hover:to-emerald-700 text-white font-bold shadow-md shadow-emerald-500/25"
                        isLoading={processingId === booking._id}
                        onClick={() => handleRespond(booking._id, 'accept')}
                      >
                        Accept Booking
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-rose-300 text-rose-700 hover:text-white hover:bg-gradient-to-r hover:from-rose-500 hover:to-pink-600 hover:border-transparent font-bold transition-all"
                        isLoading={processingId === booking._id}
                        onClick={() => handleRespond(booking._id, 'reject')}
                      >
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <p className="text-[11px] text-gray-400">
                      Processed on {formatDate(booking.updatedAt)}
                    </p>
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
