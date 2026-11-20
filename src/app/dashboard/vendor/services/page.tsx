'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
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
} from 'lucide-react';

export default function MyServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

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
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-950">
              My Wedding Services
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Manage your published listings, toggle active visibility, and monitor admin approval.
            </p>
          </div>
          <Link href="/dashboard/vendor/add-service">
            <Button variant="primary" size="sm">
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Add New Service
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-3xl" />
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-rose-100 p-8 max-w-md mx-auto">
            <Building2 className="w-12 h-12 text-rose-500 mx-auto mb-4" />
            <h3 className="text-lg font-serif font-bold text-gray-900 mb-1">
              No Services Created Yet
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              Create your first wedding service listing to start receiving booking inquiries from engaged couples.
            </p>
            <Link href="/dashboard/vendor/add-service">
              <Button variant="primary">Create Your First Listing</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {services.map((service) => (
              <div
                key={service._id}
                className="bg-white rounded-3xl p-6 border border-rose-100/80 shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Details */}
                <div className="flex items-start sm:items-center gap-4">
                  <img
                    src={service.images?.[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80'}
                    alt={service.serviceName}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-rose-100 shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                        {service.category}
                      </span>

                      {/* Approval Status */}
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          service.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : service.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {service.status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                        {service.status === 'pending' && <Clock className="w-3 h-3" />}
                        {service.status === 'rejected' && <XCircle className="w-3 h-3" />}
                        {service.status} by Admin
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-base sm:text-lg text-gray-950">
                      {service.serviceName}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        {service.location}
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-rose-600 font-serif text-sm">
                        {formatCurrency(service.price)}
                      </span>
                      <span>•</span>
                      <span>Created {formatDate(service.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex md:flex-col items-center md:items-end justify-between pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 gap-3 shrink-0">
                  <div className="flex items-center gap-2">
                    {/* Active Toggle */}
                    <button
                      onClick={() => handleToggleActive(service)}
                      disabled={actionId === service._id}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                        service.isActive
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
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
                        className="p-2 rounded-xl text-gray-500 hover:text-rose-600 hover:bg-rose-50 border border-gray-200"
                        title="View Public Page"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    )}

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteService(service._id)}
                      disabled={actionId === service._id}
                      className="p-2 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 border border-gray-200 cursor-pointer"
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
