'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { RoleGuard } from '@/components/common/RoleGuard';
import { Service } from '@/types';
import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  FileCheck2,
  Search,
  CheckCircle2,
  XCircle,
  Trash2,
  ExternalLink,
  MapPin,
  Clock,
  Filter,
} from 'lucide-react';

export default function ManageServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/services', {
        params: {
          search: search || undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined,
        },
      });
      const list = res?.services || res?.data || [];
      setServices(list);
    } catch (err: any) {
      toast.error('Failed to load services: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchServices();
  };

  const handleUpdateStatus = async (serviceId: string, newStatus: 'approved' | 'rejected') => {
    setActionId(serviceId);
    try {
      const res = await api.put(`/admin/services/${serviceId}/status`, {
        status: newStatus,
      });
      toast.success(res.message || `Service status updated to ${newStatus}.`);
      fetchServices();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update service status.');
    } finally {
      setActionId(null);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this wedding service permanently?')) return;

    setActionId(serviceId);
    try {
      await api.delete(`/admin/services/${serviceId}`);
      toast.success('Service deleted successfully.');
      fetchServices();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete service.');
    } finally {
      setActionId(null);
    }
  };

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-950">
            Manage & Moderate Wedding Services
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Review submitted vendor applications, approve genuine listings, reject non-compliant packages, and remove inappropriate content.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="flex-1 w-full max-w-md">
            <Input
              placeholder="Search by service name or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search className="w-4 h-4 text-gray-400" />}
            />
          </form>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500 font-medium">Filter Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending Approval</option>
              <option value="approved">Approved & Published</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Services List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-3xl" />
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 max-w-md mx-auto">
            <FileCheck2 className="w-12 h-12 text-rose-500 mx-auto mb-3" />
            <h3 className="text-lg font-serif font-bold text-gray-900 mb-1">
              No Services Found
            </h3>
            <p className="text-xs text-gray-500">
              There are no wedding services matching your current search or status filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {services.map((service) => (
              <div
                key={service._id}
                className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Details */}
                <div className="flex items-start sm:items-center gap-4">
                  <img
                    src={service.images?.[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80'}
                    alt=""
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-rose-100 shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                        {service.category}
                      </span>
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
                        {service.status}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-base sm:text-lg text-gray-950">
                      {service.serviceName}
                    </h3>

                    <p className="text-xs text-gray-500 flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        {service.location}
                      </span>
                      <span>•</span>
                      <span className="font-bold text-rose-600 font-serif">
                        {formatCurrency(service.price)}
                      </span>
                      <span>•</span>
                      <span>Vendor: <strong>{service.vendorId?.businessName || service.vendorId?.name}</strong></span>
                    </p>
                  </div>
                </div>

                {/* Moderation Controls */}
                <div className="flex md:flex-col items-center md:items-end justify-between pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 gap-3 shrink-0">
                  <div className="flex items-center gap-2">
                    {service.status !== 'approved' && (
                      <Button
                        size="sm"
                        variant="primary"
                        isLoading={actionId === service._id}
                        onClick={() => handleUpdateStatus(service._id, 'approved')}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approve
                      </Button>
                    )}

                    {service.status !== 'rejected' && (
                      <Button
                        size="sm"
                        variant="outline"
                        isLoading={actionId === service._id}
                        onClick={() => handleUpdateStatus(service._id, 'rejected')}
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                      </Button>
                    )}

                    <Link
                      href={`/services/${service._id}`}
                      target="_blank"
                      className="p-2 rounded-xl text-gray-500 hover:text-rose-600 hover:bg-rose-50 border border-gray-200"
                      title="Preview Listing"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>

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
                    Submitted on {formatDate(service.createdAt)}
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
