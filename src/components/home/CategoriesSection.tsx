'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Camera,
  Castle,
  Flower2,
  Utensils,
  Sparkles,
  Shirt,
  ArrowRight,
} from 'lucide-react';

const categories = [
  {
    name: 'Photography & Videography',
    description: 'Capture emotional moments with high-definition drone & 4K cinematic storytelling.',
    icon: Camera,
    color: 'from-blue-500/10 to-indigo-500/10 text-indigo-600 border-indigo-200/60',
    count: '80+ Pros',
    href: '/services?category=Photography+%26+Videography',
    image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Wedding Venues',
    description: 'Enchanting castles, coastal pavilions, vineyard estates, and luxury grand ballrooms.',
    icon: Castle,
    color: 'from-rose-500/10 to-pink-500/10 text-rose-600 border-rose-200/60',
    count: '120+ Venues',
    href: '/services?category=Wedding+Venues',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Decoration & Florist',
    description: 'Romantic floral arches, centerpieces, fairy lights, and bespoke botanical backdrops.',
    icon: Flower2,
    color: 'from-emerald-500/10 to-teal-500/10 text-emerald-600 border-emerald-200/60',
    count: '65+ Florists',
    href: '/services?category=Decoration+%26+Florist',
    image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Catering Services',
    description: 'Michelin-inspired plated dinners, gourmet dessert bars, and bespoke wedding cakes.',
    icon: Utensils,
    color: 'from-amber-500/10 to-orange-500/10 text-amber-600 border-amber-200/60',
    count: '45+ Chefs',
    href: '/services?category=Catering+Services',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Makeup & Styling',
    description: 'HD airbrush glamour, luxury bridal hairstyles, trial sessions, and wedding party pampering.',
    icon: Sparkles,
    color: 'from-purple-500/10 to-pink-500/10 text-purple-600 border-purple-200/60',
    count: '90+ Stylists',
    href: '/services?category=Makeup+%26+Styling',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Wedding Fashion',
    description: 'Handcrafted haute couture wedding gowns, Italian wool tuxedos, and bespoke accessories.',
    icon: Shirt,
    color: 'from-pink-500/10 to-rose-500/10 text-pink-600 border-pink-200/60',
    count: '55+ Designers',
    href: '/services?category=Wedding+Fashion',
    image: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=600&q=80',
  },
];

export function CategoriesSection() {
  return (
    <section className="py-20 bg-slate-50/60 border-y border-rose-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 bg-rose-100/70 px-3 py-1 rounded-full border border-rose-200/50">
            Everything for Your Big Day
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-950 mt-3">
            Wedding Service Categories
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Explore vetted artisans across every discipline to design a cohesive, unforgettable celebration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.06 }}
              >
                <Link
                  href={cat.href}
                  className="group block relative rounded-2xl overflow-hidden bg-white border border-rose-100 shadow-xs hover:shadow-xl transition-all duration-300 p-6 h-full flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${cat.color} flex items-center justify-center border shadow-xs group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                        {cat.count}
                      </span>
                    </div>

                    <h3 className="text-lg font-serif font-bold text-gray-900 group-hover:text-rose-600 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-rose-600 group-hover:translate-x-1 transition-transform">
                    <span>Browse {cat.name.split(' ')[0]}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
