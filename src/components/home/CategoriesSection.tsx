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
    accent: {
      card: 'from-blue-50 via-sky-50 to-indigo-50',
      icon: 'from-blue-500 to-indigo-600',
      chip: 'bg-blue-600/90 text-white border-blue-300',
      title: 'group-hover:text-blue-700',
      accentText: 'text-blue-600',
    },
    count: '80+ Pros',
    href: '/services?category=Photography+%26+Videography',
    image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Wedding Venues',
    description: 'Enchanting castles, coastal pavilions, vineyard estates, and luxury grand ballrooms.',
    icon: Castle,
    accent: {
      card: 'from-red-50 via-red-50 to-red-50',
      icon: 'from-red-500 to-red-600',
      chip: 'bg-red-600/90 text-white border-red-300',
      title: 'group-hover:text-red-700',
      accentText: 'text-red-600',
    },
    count: '120+ Venues',
    href: '/services?category=Wedding+Venues',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Decoration & Florist',
    description: 'Romantic floral arches, centerpieces, fairy lights, and bespoke botanical backdrops.',
    icon: Flower2,
    accent: {
      card: 'from-emerald-50 via-teal-50 to-cyan-50',
      icon: 'from-emerald-500 to-teal-600',
      chip: 'bg-emerald-600/90 text-white border-emerald-300',
      title: 'group-hover:text-emerald-700',
      accentText: 'text-emerald-600',
    },
    count: '65+ Florists',
    href: '/services?category=Decoration+%26+Florist',
    image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Catering Services',
    description: 'Michelin-inspired plated dinners, gourmet dessert bars, and bespoke wedding cakes.',
    icon: Utensils,
    accent: {
      card: 'from-amber-50 via-orange-50 to-yellow-50',
      icon: 'from-amber-500 to-orange-600',
      chip: 'bg-amber-600/90 text-white border-amber-300',
      title: 'group-hover:text-amber-700',
      accentText: 'text-amber-600',
    },
    count: '45+ Chefs',
    href: '/services?category=Catering+Services',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Makeup & Styling',
    description: 'HD airbrush glamour, luxury bridal hairstyles, trial sessions, and wedding party pampering.',
    icon: Sparkles,
    accent: {
      card: 'from-purple-50 via-red-50 to-red-50',
      icon: 'from-purple-500 to-red-600',
      chip: 'bg-purple-600/90 text-white border-purple-300',
      title: 'group-hover:text-purple-700',
      accentText: 'text-purple-600',
    },
    count: '90+ Stylists',
    href: '/services?category=Makeup+%26+Styling',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Wedding Fashion',
    description: 'Handcrafted haute couture wedding gowns, Italian wool tuxedos, and bespoke accessories.',
    icon: Shirt,
    accent: {
      card: 'from-red-50 via-red-50 to-red-50',
      icon: 'from-red-500 to-red-600',
      chip: 'bg-red-600/90 text-white border-red-300',
      title: 'group-hover:text-red-700',
      accentText: 'text-red-600',
    },
    count: '55+ Designers',
    href: '/services?category=Wedding+Fashion',
    image: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=600&q=80',
  },
];

export function CategoriesSection() {
  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-b from-red-50/55 via-amber-50/30 to-red-50/45 border-y border-red-100/60">
      <div className="aurora-orb absolute top-10 -left-40 w-80 h-80 bg-red-200/40" />
      <div className="aurora-orb aurora-orb--slow absolute bottom-0 -right-32 w-96 h-96 bg-sky-200/40" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-red-600 via-red-500 to-amber-500 px-4 py-1.5 rounded-full shadow-md shadow-red-500/20">
            Everything for Your Big Day
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-950 mt-4">
            Wedding Service <span className="text-gradient-rose">Categories</span>
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
                  className={`group block relative h-full rounded-3xl overflow-hidden bg-gradient-to-br ${cat.accent.card} border border-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
                >
                  {/* Photo header */}
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
                    <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold border shadow-md ${cat.accent.chip}`}>
                      {cat.count}
                    </span>
                  </div>

                  {/* Overlapping colourful icon */}
                  <div className={`relative -mt-7 ml-5 w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.accent.icon} flex items-center justify-center text-white shadow-lg ring-4 ring-white group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                    <Icon className="w-7 h-7" />
                  </div>

                  <div className="px-5 pt-3 pb-5">
                    <h3 className={`text-lg font-serif font-bold text-gray-900 ${cat.accent.title} transition-colors`}>
                      {cat.name}
                    </h3>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                      {cat.description}
                    </p>
                    <div className={`mt-5 pt-4 border-t border-white/70 flex items-center justify-between text-xs font-bold ${cat.accent.accentText}`}>
                      <span>Browse {cat.name.split(' ')[0]}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
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
