'use client';

import React, { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Service } from '@/types';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Search,
  MapPin,
  Filter,
  Sparkles,
  ArrowUpDown,
  Building2,
  Calendar,
  X,
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Wedding Venues',
  'Photography & Videography',
  'Decoration & Florist',
  'Catering Services',
  'Makeup & Styling',
  'Wedding Fashion',
];

export default function BrowseServicesPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
        </div>
      }
    >
      <BrowseServicesContent />
    </React.Suspense>
  );
}

function BrowseServicesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const initialCategory = searchParams.get('category') || 'All';
  const [category, setCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/services', {
        params: {
          search: searchTerm || undefined,
          category: category !== 'All' ? category : undefined,
          location: locationTerm || undefined,
          sortBy,
          page,
          limit: 12,
        },
      });

      const list = res?.services || res?.data || [];
      setServices(list);
      setTotalPages(res?.totalPages || res?.pagination?.totalPages || 1);
      setTotalCount(res?.total || res?.pagination?.total || list.length);
    } catch (err) {
      console.error('Failed to fetch services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [category, sortBy, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchServices();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setLocationTerm('');
    setCategory('All');
    setSortBy('newest');
    setPage(1);
  };

  const handleCardClick = (serviceId: string) => {
    if (!isAuthenticated) {
      router.push(`/signin?from=${encodeURIComponent(`/services/${serviceId}`)}`);
    } else {
      router.push(`/services/${serviceId}`);
    }
  };

  return (
    <div className="min-h-screen bg-white/40 py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-red-600 via-red-500 to-amber-500 px-4 py-1.5 rounded-full shadow-md shadow-red-500/20">
            Marketplace Directory
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-gray-950 mt-3">
            Browse Wedding <span className="text-gradient-rose">Services</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Search, compare, and connect with top-rated wedding professionals for your special day.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-3xl p-6 border border-red-100 shadow-md shadow-red-500/5 mb-10 space-y-5">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
            <div className="md:col-span-5">
              <Input
                placeholder="Search service name, description, keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-4 h-4 text-gray-400" />}
              />
            </div>
            <div className="md:col-span-4">
              <Input
                placeholder="City or state (e.g. Los Angeles, CA)..."
                value={locationTerm}
                onChange={(e) => setLocationTerm(e.target.value)}
                icon={<MapPin className="w-4 h-4 text-gray-400" />}
              />
            </div>
            <div className="md:col-span-3 flex items-center gap-2">
              <Button type="submit" variant="primary" className="w-full">
                Search
              </Button>
              {(searchTerm || locationTerm || category !== 'All') && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Reset filters"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>

          {/* Categories Pill Bar */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none w-full lg:w-auto">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5" /> Category:
              </span>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategory(cat);
                    setPage(1);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                    category === cat
                      ? 'bg-gradient-to-r from-red-600 to-red-600 text-white shadow-md shadow-red-500/20 font-semibold'
                      : 'bg-white border border-red-100 text-gray-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-50 hover:text-red-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 ml-auto">
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-500 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              >
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Service Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6 text-xs text-gray-500">
          <span>
            Showing <strong className="text-gray-900">{services.length}</strong> of{' '}
            <strong className="text-gray-900">{totalCount}</strong> services
          </span>
          {!isAuthenticated && (
            <span className="text-red-600 font-medium bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
              Note: Sign in required to view details & book
            </span>
          )}
        </div>

        {/* Service Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-3xl border border-gray-200 bg-white p-5 space-y-4">
                <Skeleton className="h-56 w-full rounded-2xl" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="pt-4 flex justify-between items-center border-t border-gray-100">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-9 w-28" />
                </div>
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 bg-gradient-to-br from-red-50 via-red-50 to-amber-50 rounded-3xl border border-red-100 p-8 shadow-sm max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-500 text-white mx-auto flex items-center justify-center mb-4 shadow-md shadow-red-500/25">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
              No Wedding Services Found
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              We couldn't find any services matching your search criteria. Try modifying your filters or browse all categories.
            </p>
            <Button variant="outline" onClick={handleResetFilters}>
              Reset All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service._id}
                className="group bg-white rounded-3xl border border-red-100/80 shadow-sm hover:shadow-2xl hover:shadow-red-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Image */}
                <div className="relative h-60 w-full overflow-hidden bg-gradient-to-br from-red-100 via-red-100 to-amber-100">
                  <img
                    src={service.images?.[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'}
                    alt={service.serviceName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                    <Badge variant="default" className="bg-white/95 text-red-900 shadow-sm backdrop-blur-xs font-semibold">
                      {service.category}
                    </Badge>
                  </div>
                  {service.vendorId?.subscriptionPlan === 'premium' && (
                    <div className="absolute top-3.5 right-3.5">
                      <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-bold shadow-md flex items-center gap-1">
                        ★ Premium
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                      <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span className="truncate">{service.location}</span>
                    </div>

                    <h3 className="text-lg font-serif font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-1">
                      {service.serviceName}
                    </h3>

                    <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Vendor Info */}
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2.5">
                      {service.vendorId?.image ? (
                        <img
                          src={service.vendorId.image}
                          alt={service.vendorId.name}
                          className="w-7 h-7 rounded-full object-cover border border-red-200"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-xs font-bold">
                          <Building2 className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <div className="truncate">
                        <p className="text-xs font-semibold text-gray-800 truncate">
                          {service.vendorId?.businessName || service.vendorId?.name || 'Verified Vendor'}
                        </p>
                        <p className="text-[10px] text-gray-400">Verified Vendor</p>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-gray-400 font-medium">Starting from</p>
                      <p className="text-xl font-bold font-serif text-gradient-rose">
                        {formatCurrency(service.price)}
                      </p>
                    </div>

                    <button
                      onClick={() => handleCardClick(service._id)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md transition-all cursor-pointer"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="text-xs font-medium text-gray-600 px-3">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
