'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Service } from '@/types';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, ArrowRight, Sparkles, Building2 } from 'lucide-react';

export function FeaturedServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/services/featured');
        const list = res?.services || res?.data || [];
        setServices(list);
      } catch (err) {
        console.error('Failed to load featured services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-b from-red-50/45 via-white/80 to-red-50/35">
      <div className="aurora-orb absolute -left-40 top-10 w-80 h-80 bg-red-200/35" />
      <div className="aurora-orb aurora-orb--slow absolute -right-40 bottom-0 w-80 h-80 bg-violet-200/35" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-semibold mb-2 shadow-md shadow-red-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              Handpicked Excellence
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-950">
              Featured Wedding <span className="text-gradient-rose">Services</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-xl">
              Explore our highest-rated, approved wedding vendors ready to bring your celebration to life.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link href="/services">
              <Button variant="outline" className="gap-2">
                View All Services
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-2xl border border-gray-100 p-4 space-y-3">
                <Skeleton className="h-56 w-full rounded-xl" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="pt-4 flex justify-between items-center">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-9 w-28" />
                </div>
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-br from-red-50 via-red-50 to-amber-50 rounded-3xl border border-red-100">
            <p className="text-gray-500">No approved wedding services available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="group bg-white rounded-3xl border border-red-100/80 shadow-sm hover:shadow-2xl hover:shadow-red-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Image Frame */}
                <div className="relative h-60 w-full overflow-hidden bg-gradient-to-br from-red-100 via-red-100 to-amber-100">
                  <img
                    src={service.images?.[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'}
                    alt={service.serviceName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-red-950/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <Badge variant="default" className="bg-white/95 text-red-800 shadow-sm backdrop-blur-xs font-semibold">
                      {service.category}
                    </Badge>
                  </div>
                  {service.vendorId?.subscriptionPlan === 'premium' && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-bold shadow-md flex items-center gap-1">
                        ★ Premium
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                      <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span className="truncate">{service.location}</span>
                    </div>

                    {/* Service Name */}
                    <h3 className="text-lg font-serif font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-1">
                      {service.serviceName}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Vendor Information */}
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
                        <p className="text-[10px] text-gray-400">Official Provider</p>
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
                    <Link href={`/services/${service._id}`}>
                      <Button size="sm" variant="default" className="shadow-xs">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
