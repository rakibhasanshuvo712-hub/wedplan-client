'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Service } from '@/types';
import { api, ApiError } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  MapPin,
  Calendar,
  Building2,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  Send,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';

export default function ServiceDetailsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
        </div>
      }
    >
      <ServiceDetailsContent />
    </React.Suspense>
  );
}

function ServiceDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const serviceId = params?.id as string;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');

  // Booking Form State
  const [eventDate, setEventDate] = useState('');
  const [minDate, setMinDate] = useState('');

  useEffect(() => {
    setMinDate(new Date().toISOString().split('T')[0]);
  }, []);
  const [eventLocation, setEventLocation] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    // If not authenticated, redirect to sign in immediately as required
    if (!authLoading && !isAuthenticated) {
      router.replace(`/signin?from=${encodeURIComponent(`/services/${serviceId}`)}`);
      return;
    }

    const fetchService = async () => {
      try {
        const res = await api.get(`/services/${serviceId}`);
        const serviceData = res?.service || res?.data;
        if (serviceData) {
          setService(serviceData);
          setSelectedImage(serviceData.images?.[0] || '');
        } else {
          setError('Wedding service not found.');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load service details.');
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      fetchService();
    }
  }, [serviceId, authLoading, isAuthenticated, router]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !user) {
      toast.error('You must be signed in to submit a booking request.');
      router.push(`/signin?from=${encodeURIComponent(`/services/${serviceId}`)}`);
      return;
    }

    if (user.role !== 'customer') {
      toast.error('Only customers can submit booking requests.');
      return;
    }

    if (!eventDate || !eventLocation) {
      toast.error('Please specify the event date and location.');
      return;
    }

    setIsSubmittingBooking(true);
    try {
      const res = await api.post('/bookings', {
        serviceId,
        eventDate,
        eventLocation,
        message,
      });

      setBookingSuccess(true);
      toast.success(res.message || 'Booking request submitted successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit booking request.');
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="h-8 w-40 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-4">
            <Skeleton className="h-[450px] w-full rounded-3xl" />
            <div className="flex gap-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-24 rounded-xl" />
              ))}
            </div>
          </div>
          <div className="lg:col-span-5 space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md bg-white p-8 rounded-3xl border border-rose-100 shadow-sm">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">
            Service Unavailable
          </h2>
          <p className="text-sm text-gray-600 mb-6">{error || 'Service not found.'}</p>
          <Link href="/services">
            <Button variant="default">Browse All Wedding Services</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isOwnService = user && service.vendorId?._id === user._id;
  const isVendor = user?.role === 'vendor';
  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <div className="mb-6">
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-rose-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Directory
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Visual Gallery & Detailed Description */}
          <div className="lg:col-span-7 space-y-8">
            {/* Main Stage Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-md border border-rose-100 bg-black aspect-[4/3]">
              <img
                src={selectedImage || service.images?.[0]}
                alt={service.serviceName}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute top-4 left-4">
                <Badge variant="default" className="bg-white/95 text-rose-900 font-bold shadow-md">
                  {service.category}
                </Badge>
              </div>
            </div>

            {/* Thumbnail Row */}
            {service.images && service.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                {service.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-24 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      selectedImage === img
                        ? 'border-rose-600 shadow-md scale-95'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Service Overview */}
            <div className="bg-white rounded-3xl p-8 border border-rose-100/80 shadow-xs space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-950">
                  {service.serviceName}
                </h1>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{service.location}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-base font-semibold text-gray-900 mb-2">About This Service</h3>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {service.description}
                </p>
              </div>

              {/* Vendor Profile Card */}
              <div className="pt-6 border-t border-gray-100">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  Provided by
                </h4>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-50/40 border border-rose-100/80">
                  <div className="flex items-center gap-3">
                    {service.vendorId?.image ? (
                      <img
                        src={service.vendorId.image}
                        alt={service.vendorId.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-rose-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-base">
                        {service.vendorId?.name?.charAt(0) || 'V'}
                      </div>
                    )}
                    <div>
                      <h4 className="font-serif font-bold text-gray-900 text-base">
                        {service.vendorId?.businessName || service.vendorId?.name}
                      </h4>
                      <p className="text-xs text-gray-500">{service.vendorId?.email}</p>
                    </div>
                  </div>

                  {service.vendorId?.subscriptionPlan === 'premium' && (
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1 border border-amber-200">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                      Premium Vendor
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Booking Request Form */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-rose-100/80 shadow-md shadow-rose-500/5 sticky top-24">
              <div className="pb-6 border-b border-gray-100 flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                    Package Price
                  </span>
                  <p className="text-3xl font-serif font-bold text-rose-600 mt-1">
                    {formatCurrency(service.price)}
                  </p>
                </div>
                <Badge variant="success" className="px-3 py-1">
                  Available for Booking
                </Badge>
              </div>

              {bookingSuccess ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-gray-900">
                    Booking Request Sent!
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    The vendor has received your event request for {eventDate}. You can track the status in your customer dashboard.
                  </p>
                  <div className="pt-2 flex flex-col gap-2">
                    <Link href="/dashboard/customer/bookings">
                      <Button variant="primary" className="w-full">
                        View in Dashboard
                      </Button>
                    </Link>
                    <Button variant="ghost" onClick={() => setBookingSuccess(false)}>
                      Submit Another Request
                    </Button>
                  </div>
                </div>
              ) : isOwnService ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif font-bold text-gray-900">Your Listing</h4>
                  <p className="text-xs text-gray-500">
                    You are the author of this wedding service. Vendors cannot book their own services.
                  </p>
                  <Link href="/dashboard/vendor/services">
                    <Button variant="outline" className="w-full">
                      Manage in Vendor Dashboard
                    </Button>
                  </Link>
                </div>
              ) : isAdmin ? (
                <div className="py-8 text-center space-y-3">
                  <ShieldCheck className="w-10 h-10 text-rose-600 mx-auto" />
                  <h4 className="font-serif font-bold text-gray-900">Administrator Preview</h4>
                  <p className="text-xs text-gray-500">
                    You are viewing this listing as an Administrator. Customer bookings cannot be submitted from admin accounts.
                  </p>
                  <Link href="/dashboard/admin/services">
                    <Button variant="outline" className="w-full">
                      Moderate Services
                    </Button>
                  </Link>
                </div>
              ) : isVendor ? (
                <div className="py-8 text-center space-y-3">
                  <p className="text-xs text-amber-700 bg-amber-50 p-4 rounded-2xl border border-amber-200">
                    You are signed in with a <strong>Vendor</strong> account. To book wedding services for your own event, please sign in with a Customer account.
                  </p>
                </div>
              ) : (
                /* Customer Booking Request Form */
                <form onSubmit={handleBookingSubmit} className="pt-6 space-y-4">
                  <h3 className="font-serif font-bold text-gray-900 text-lg">
                    Request Booking
                  </h3>
                  <p className="text-xs text-gray-500">
                    Submit your requested wedding date and location to verify availability and lock your date.
                  </p>

                  <Input
                    type="date"
                    label="Wedding / Event Date *"
                    required
                    min={minDate || undefined}
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />

                  <Input
                    label="Event Location / Venue *"
                    placeholder="e.g. Bel-Air Bay Club, Pacific Palisades, CA"
                    required
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                  />

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-gray-700">
                      Special Requests / Event Details (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Share estimated guest count, theme, timeline, or questions..."
                      className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 placeholder:text-gray-400"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full mt-2"
                    isLoading={isSubmittingBooking}
                  >
                    <Send className="w-4 h-4 mr-1.5" />
                    Submit Booking Request
                  </Button>

                  <p className="text-[11px] text-gray-400 text-center">
                    Protected by WedPlan Anti-Double-Booking Guarantee. You will not be charged until the vendor accepts.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
