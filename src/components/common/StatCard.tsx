'use client';

import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  icon: LucideIcon;
  /** Full static Tailwind class strings so they are detected at build time. */
  iconGradient: string;
  cardGradient: string;
  border: string;
  text: string;
  bar: string;
  subtext?: string;
  loading?: boolean;
}

/**
 * Colourful, gently animated dashboard statistic tile.
 * The icon lifts and rotates on hover while the card floats slightly.
 */
export function StatCard({
  label,
  value,
  icon: Icon,
  iconGradient,
  cardGradient,
  border,
  text,
  bar,
  subtext,
  loading,
}: StatCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${cardGradient} border ${border} p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
    >
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${bar}`} />
      <div className="flex items-center gap-3.5">
        <div
          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${iconGradient} text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300`}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div className="min-w-0">
          <p className={`text-[11px] font-bold uppercase tracking-wider ${text}`}>{label}</p>
          <h3 className="text-2xl font-serif font-bold text-gray-900 mt-0.5">
            {loading ? <span className="block h-7 w-12 animate-pulse rounded-lg bg-gray-200/80" /> : value}
          </h3>
          {subtext && <p className="text-[10px] text-gray-500 mt-0.5 truncate">{subtext}</p>}
        </div>
      </div>
    </div>
  );
}
