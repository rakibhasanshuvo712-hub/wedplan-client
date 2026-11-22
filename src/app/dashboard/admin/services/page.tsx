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
      <div className="relative space-y-6">
        {/* Gradient Page Header */}
        <div className="relative overflow-hidden rounded-3xl border border-red-100 bg-gradient-to-br from-red-50 via-red-50 to-amber-50 p-5 sm:p-6 shadow-[0_18px_45px_-20px_rgba(217,70,239,0.45)]">
          <div className="aurora-orb absolute -top-16 -right-12 h-56 w-56 bg-red-300/40" />
          <div className="aurora-orb aurora-orb--slow absolute -bottom-24 left-1/4 h-48 w-48 bg-amber-300/30" />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-red-600 via-red-600 to-red-600 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white shadow-lg shadow-red-500/30">
                <FileCheck2 className="h-3.5 w-3.5" /> Moderation Desk
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gradient-rose">
                Manage & Moderate Wedding Services
              </h1>
              <p className="text-xs sm:text-sm text-red-900/60 mt-1">
                Review submitted vendor applications, approve genuine listings, reject non-compliant packages, and remove inappropriate content.
              </p>
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="glass-card rounded-3xl p-5 border border-white/70 shadow-[0_12px_35px_-18px_rgba(244,63,94,0.4)] flex flex-col md:flex-row items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="flex-1 w-full max-w-md">
            <Input
              placeholder="Search by service name or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search className="w-4 h-4 text-red-400" />}
              className="bg-white/90 border-red-200 shadow-sm shadow-red-100 focus:border-red-400 focus:ring-red-400/30"
            />
          </form>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-500 text-white shadow-md shadow-red-400/30">
              <Filter className="w-4 h-4" />
            </div>
            <span className="text-xs text-red-700 font-semibold">Filter Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-semibold text-red-900 bg-white/90 border border-red-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400/30 focus:border-red-400 shadow-sm"
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
          <div className="relative overflow-hidden text-center py-16 rounded-3xl p-8 max-w-md mx-auto border border-red-100 bg-gradient-to-br from-red-50 via-red-50 to-amber-50 shadow-[0_18px_45px_-22px_rgba(225,29,72,0.35)]">
            <div className="aurora-orb absolute -top-10 -right-10 h-40 w-40 bg-red-300/30" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-400 via-red-400 to-amber-400 text-white mx-auto mb-3 shadow-lg shadow-red-400/30">
              <FileCheck2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-serif font-bold text-gradient-rose mb-1">
              No Services Found
            </h3>
            <p className="text-xs text-red-900/60">
              There are no wedding services matching your current search or status filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {services.map((service) => (
              <div
                key={service._id}
                className="glass-card rounded-3xl p-6 border border-white/70 shadow-[0_12px_35px_-20px_rgba(190,24,93,0.3)] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-[0_18px_45px_-20px_rgba(217,70,239,0.4)] hover:-translate-y-0.5 transition-all duration-200"
              >
                {/* Details */}
                <div className="flex items-start sm:items-center gap-4">
                  <img
                    src={service.images?.[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80'}
                    alt=""
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-red-100 shadow-md shadow-red-200/50 shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-gradient-to-r from-red-500 to-red-500 px-2 py-0.5 rounded-full shadow-sm shadow-red-300/50">
                        {service.category}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ring-1 ${
                          service.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800 ring-emerald-200'
                            : service.status === 'pending'
                            ? 'bg-amber-100 text-amber-800 ring-amber-200'
                            : 'bg-gradient-to-r from-red-100 to-red-100 text-red-700 ring-red-200'
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
                        <MapPin className="w-3.5 h-3.5 text-violet-400" />
                        {service.location}
                      </span>
                      <span>•</span>
                      <span className="font-bold text-gradient-rose font-serif">
                        {formatCurrency(service.price)}
                      </span>
                      <span>•</span>
                      <span>
                        Vendor: <strong className="text-violet-700">{service.vendorId?.businessName || service.vendorId?.name}</strong>
                      </span>
                    </p>
                  </div>
                </div>

                {/* Moderation Controls */}
                <div className="flex md:flex-col items-center md:items-end justify-between pt-4 md:pt-0 border-t md:border-t-0 border-red-100 gap-3 shrink-0">
                  <div className="flex items-center gap-2">
                    {service.status !== 'approved' && (
                      <Button
                        size="sm"
                        variant="primary"
                        isLoading={actionId === service._id}
                        onClick={() => handleUpdateStatus(service._id, 'approved')}
                        className="border-0 bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/30 hover:from-emerald-600 hover:to-teal-600"
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
                        className="border-red-200 text-red-600 shadow-sm hover:bg-red-50 hover:border-red-300"
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                      </Button>
                    )}

                    <Link
                      href={`/services/${service._id}`}
                      target="_blank"
                      className="p-2 rounded-xl text-sky-600 hover:text-sky-700 hover:bg-sky-50 border border-sky-100 hover:border-sky-200 shadow-sm transition-colors"
                      title="Preview Listing"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => handleDeleteService(service._id)}
                      disabled={actionId === service._id}
                      className="p-2 rounded-xl text-red-500 hover:text-white hover:bg-gradient-to-br hover:from-red-500 hover:to-red-500 border border-red-100 hover:border-red-300 shadow-sm cursor-pointer transition-colors"
                      title="Delete Service"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-[11px] text-violet-400">
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
