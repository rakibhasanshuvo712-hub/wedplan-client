'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { RoleGuard } from '@/components/common/RoleGuard';
import { Service } from '@/types';
import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  Building2,
  PlusCircle,
  MapPin,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  CheckCircle2,
  Clock,
  XCircle,
  Sparkles,
} from 'lucide-react';

export default function MyServicesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const isPremium = user?.subscriptionPlan === 'premium';
  const activeCount = services.filter((s) => s.isActive !== false && s.status !== 'rejected').length;
  const isLimitReached = !isPremium && activeCount >= 3;

  const fetchMyServices = async () => {
    try {
      const res = await api.get('/services/vendor/my-services');
      const list = res?.services || res?.data || [];
      setServices(list);
    } catch (err: any) {
      toast.error('Failed to load your services: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyServices();
  }, []);

  const handleToggleActive = async (service: Service) => {
    if (!isPremium && !service.isActive && activeCount >= 3) {
      toast.error('Free plan limit reached (maximum 3 active services). Please upgrade to Premium to activate more services.', {
        action: {
          label: 'Upgrade to Premium',
          onClick: () => router.push('/dashboard/vendor/subscription'),
        },
      });
      return;
    }

    setActionId(service._id);
    try {
      const res = await api.put(`/services/${service._id}`, {
        isActive: !service.isActive,
      });
      toast.success(
        `Service is now ${!service.isActive ? 'Active & Published' : 'Paused / Inactive'}`
      );
      fetchMyServices();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update service availability.');
    } finally {
      setActionId(null);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this wedding service?')) return;

    setActionId(serviceId);
    try {
      await api.delete(`/services/${serviceId}`);
      toast.success('Service deleted successfully.');
      fetchMyServices();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete service.');
    } finally {
      setActionId(null);
    }
  };

  return (
    <RoleGuard allowedRoles={['vendor']}>
      <div className="relative space-y-6">
        <div className="aurora-orb absolute -top-24 -left-32 w-80 h-80 bg-red-300/30" />
        <div className="aurora-orb aurora-orb--slow absolute top-1/3 -right-28 w-72 h-72 bg-violet-300/25" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-red-700 bg-gradient-to-r from-red-100 to-red-100 border border-red-200/70 px-3 py-1 rounded-full shadow-sm shadow-red-500/10 mb-3">
              <Sparkles className="w-3 h-3 fill-red-400" /> Vendor Portfolio
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gradient-rose">
              My Wedding Services
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Manage your published listings, toggle active visibility, and monitor admin approval.
            </p>
          </div>
          {isLimitReached ? (
            <Link href="/dashboard/vendor/subscription">
              <Button className="bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white font-bold text-xs shadow-md shadow-red-500/15" size="sm">
                <Sparkles className="w-4 h-4 mr-1.5 fill-current" />
                Upgrade to Add More
              </Button>
            </Link>
          ) : (
            <Link href="/dashboard/vendor/add-service">
              <Button variant="primary" size="sm" className="bg-gradient-to-r from-red-600 via-red-600 to-red-600 hover:from-red-700 hover:via-red-700 hover:to-red-700 text-white font-bold shadow-lg shadow-red-500/25">
                <PlusCircle className="w-4 h-4 mr-1.5" />
                Add New Service
              </Button>
            </Link>
          )}
        </div>

        {/* Free Plan Limit Usage Indicator */}
        {!isPremium && !loading && (
          <div className={`relative overflow-hidden p-4 rounded-2xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm ${
            activeCount >= 3
              ? 'bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 border-amber-300/80 text-amber-950 shadow-amber-500/10'
              : 'bg-gradient-to-r from-red-50/80 via-red-50/80 to-violet-50/80 border-red-200/70 text-gray-800 shadow-red-500/10'
          }`}>
            <div className="relative z-10 flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-red-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/25">
                <Sparkles className="w-4 h-4 fill-white" />
              </div>
              <div>
                <span className="font-bold text-gradient-gold">Free Plan Limit:</span>{' '}
                <span>
                  <strong>{activeCount} of 3</strong> active services published.
                  {activeCount >= 3
                    ? ' You have reached the maximum allowed active services on the Free Plan.'
                    : ` You can publish ${3 - activeCount} more service${3 - activeCount > 1 ? 's' : ''} on this plan.`}
                </span>
              </div>
            </div>
            {activeCount >= 3 ? (
              <Link href="/dashboard/vendor/subscription">
                <Button size="sm" className="bg-gradient-to-r from-amber-600 to-red-600 text-white font-bold text-xs shrink-0 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 mr-1 fill-current" />
                  Upgrade to Premium ($49/yr)
                </Button>
              </Link>
            ) : (
              <Link href="/dashboard/vendor/subscription" className="text-amber-800 hover:text-amber-950 font-semibold underline text-xs">
                Unlock Unlimited with Premium
              </Link>
            )}
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-3xl ring-1 ring-red-100/70" />
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="relative overflow-hidden text-center py-20 bg-gradient-to-br from-white via-red-50/70 to-red-50/70 rounded-3xl border border-red-200/70 p-8 max-w-md mx-auto shadow-lg shadow-red-500/10">
            <div className="aurora-orb absolute -top-16 -left-16 w-48 h-48 bg-red-300/30" />
            <div className="aurora-orb aurora-orb--slow absolute -bottom-16 -right-16 w-48 h-48 bg-violet-300/30" />
            <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 via-red-500 to-red-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-500/25">
              <Building2 className="w-8 h-8" />
            </div>
            <h3 className="relative z-10 text-lg font-serif font-bold text-gradient-rose mb-1">
              No Services Created Yet
            </h3>
            <p className="relative z-10 text-xs text-gray-600 mb-6">
              Create your first wedding service listing to start receiving booking inquiries from engaged couples.
            </p>
            <Link href="/dashboard/vendor/add-service" className="relative z-10">
              <Button className="bg-gradient-to-r from-red-600 via-red-600 to-red-600 hover:from-red-700 hover:via-red-700 hover:to-red-700 text-white font-bold shadow-lg shadow-red-500/25">Create Your First Listing</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {services.map((service) => (
              <div
                key={service._id}
                className="group relative overflow-hidden bg-white rounded-3xl p-6 border border-red-100/80 shadow-sm shadow-red-500/5 hover:shadow-xl hover:shadow-red-500/10 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-500 via-red-500 to-amber-400" />
                <div className="aurora-orb absolute -bottom-20 -right-16 w-56 h-56 bg-violet-200/20 group-hover:bg-red-200/30 transition-colors" />
                {/* Details */}
                <div className="relative z-10 flex items-start sm:items-center gap-4">
                  <img
                    src={service.images?.[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80'}
                    alt={service.serviceName}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-red-200/80 shadow-md shadow-red-500/10 shrink-0 bg-gradient-to-br from-red-100 via-red-100 to-amber-100"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-gradient-to-r from-red-500 to-red-600 px-2 py-0.5 rounded-full shadow-sm shadow-red-500/20">
                        {service.category}
                      </span>

                      {/* Approval Status */}
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${
                          service.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200/80 shadow-emerald-500/10'
                            : service.status === 'pending'
                            ? 'bg-amber-100 text-amber-800 border-amber-200/80 shadow-amber-500/10'
                            : 'bg-red-100 text-red-800 border-red-200/80 shadow-red-500/10'
                        }`}
                      >
                        {service.status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                        {service.status === 'pending' && <Clock className="w-3 h-3" />}
                        {service.status === 'rejected' && <XCircle className="w-3 h-3" />}
                        {service.status} by Admin
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-base sm:text-lg text-gray-950 group-hover:text-red-700 transition-colors">
                      {service.serviceName}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-red-400" />
                        {service.location}
                      </span>
                      <span>•</span>
                      <span className="font-bold text-gradient-gold font-serif text-sm">
                        {formatCurrency(service.price)}
                      </span>
                      <span>•</span>
                      <span>Created {formatDate(service.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="relative z-10 flex md:flex-col items-center md:items-end justify-between pt-4 md:pt-0 border-t md:border-t-0 border-red-100/70 gap-3 shrink-0">
                  <div className="flex items-center gap-2">
                    {/* Active Toggle */}
                    <button
                      onClick={() => handleToggleActive(service)}
                      disabled={actionId === service._id}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border shadow-sm ${
                        service.isActive
                          ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-emerald-200 hover:from-emerald-100 hover:to-teal-100 shadow-emerald-500/10'
                          : 'bg-gradient-to-r from-slate-100 to-gray-100 text-gray-600 border-gray-200 hover:from-slate-200 hover:to-gray-200'
                      }`}
                    >
                      {service.isActive ? (
                        <>
                          <ToggleRight className="w-4 h-4 text-emerald-600" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-4 h-4 text-gray-400" />
                          <span>Paused</span>
                        </>
                      )}
                    </button>

                    {/* View on public site */}
                    {service.status === 'approved' && (
                      <Link
                        href={`/services/${service._id}`}
                        target="_blank"
                        className="p-2 rounded-xl text-gray-500 hover:text-white hover:bg-gradient-to-br hover:from-red-500 hover:to-red-600 hover:border-transparent border border-gray-200 shadow-sm transition-all"
                        title="View Public Page"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    )}

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteService(service._id)}
                      disabled={actionId === service._id}
                      className="p-2 rounded-xl text-gray-500 hover:text-white hover:bg-gradient-to-br hover:from-red-500 hover:to-red-600 hover:border-transparent border border-gray-200 shadow-sm cursor-pointer transition-all"
                      title="Delete Service"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-[11px] text-gray-400">
                    {service.status === 'rejected'
                      ? 'Rejected services are hidden from public browse.'
                      : service.isActive
                      ? 'Visible in public directory'
                      : 'Hidden from public directory'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
