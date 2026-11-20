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
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-950">
            Customer Booking Requests
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Review incoming event requests, lock your availability, and accept or reject inquiries.
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40 w-full rounded-3xl" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-rose-100 p-8 max-w-md mx-auto">
            <Clock className="w-12 h-12 text-rose-500 mx-auto mb-3" />
            <h3 className="text-lg font-serif font-bold text-gray-900 mb-1">
              No Booking Requests Yet
            </h3>
            <p className="text-xs text-gray-500">
              When couples submit booking requests for your active wedding services, they will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-rose-100/80 shadow-xs hover:shadow-md transition-shadow flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                {/* Details */}
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
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
                        className="w-10 h-10 rounded-full object-cover border border-rose-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                        <User className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900">
                        {booking.customerId?.name}
                      </h4>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-gray-400" />
                        {booking.customerId?.email}
                      </p>
                    </div>
                  </div>

                  {/* Event Specifics */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 bg-gray-50/80 p-3 rounded-2xl border border-gray-100">
                    <span className="flex items-center gap-1.5 font-semibold text-rose-700">
                      <Calendar className="w-4 h-4 text-rose-600" />
                      Event Date: {formatDate(booking.eventDate)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      Location: {booking.eventLocation}
                    </span>
                  </div>

                  {booking.message && (
                    <div className="text-xs text-gray-600 flex items-start gap-2 bg-rose-50/30 p-3 rounded-2xl border border-rose-100/50">
                      <MessageSquare className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <p className="italic leading-relaxed">"{booking.message}"</p>
                    </div>
                  )}
                </div>

                {/* Status & Actions */}
                <div className="flex lg:flex-col items-center lg:items-end justify-between pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100 gap-3 shrink-0">
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

                  {booking.status === 'pending' ? (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="primary"
                        isLoading={processingId === booking._id}
                        onClick={() => handleRespond(booking._id, 'accept')}
                      >
                        Accept Booking
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
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
