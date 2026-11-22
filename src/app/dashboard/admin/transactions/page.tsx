'use client';

import React, { useEffect, useState } from 'react';
import { RoleGuard } from '@/components/common/RoleGuard';
import { Transaction } from '@/types';
import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function PlatformTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get('/admin/transactions');
        const list = res?.transactions || res?.data || [];
        setTransactions(list);
      } catch (err) {
        console.error('Failed to load transactions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const totalVolume = transactions.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="relative space-y-6">
        {/* Gradient Page Header */}
        <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-sky-50 to-violet-50 p-5 sm:p-6 shadow-[0_18px_45px_-20px_rgba(16,185,129,0.35)]">
          <div className="aurora-orb absolute -top-16 -right-12 h-56 w-56 bg-sky-300/40" />
          <div className="aurora-orb aurora-orb--slow absolute -bottom-24 left-1/3 h-48 w-48 bg-emerald-300/30" />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-600 via-sky-600 to-violet-600 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white shadow-lg shadow-sky-500/30">
                <ShieldCheck className="h-3.5 w-3.5" /> Read-Only Ledger
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gradient-aurora">
                Platform Financial Transactions
              </h1>
              <p className="text-xs sm:text-sm text-emerald-900/60 mt-1">
                Read-only Stripe transaction ledger. Payments are verified through Stripe Webhooks.
              </p>
            </div>
            <div className="shrink-0 px-4 py-2 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-2xl border border-emerald-300/60 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-emerald-500/30">
              <DollarSign className="w-4 h-4" />
              Total Revenue: <strong>{formatCurrency(totalVolume)}</strong>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="glass-card rounded-3xl border border-white/70 shadow-[0_18px_50px_-24px_rgba(16,185,129,0.3)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50/80 via-sky-50/70 to-violet-50/80 text-emerald-900/70 uppercase tracking-wider font-semibold">
                  <th className="p-4 pl-6">Vendor Name</th>
                  <th className="p-4">Business Email</th>
                  <th className="p-4">Subscription Plan</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Stripe Session ID</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50 text-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center">
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <Skeleton key={i} className="h-10 w-full" />
                        ))}
                      </div>
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center gap-2">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 via-sky-100 to-violet-100 text-emerald-500 shadow-inner">
                          <DollarSign className="h-6 w-6" />
                        </div>
                        <p className="text-sm font-serif font-bold text-gradient-aurora">No transactions yet</p>
                        <p className="text-xs text-gray-500">
                          No platform transactions recorded yet.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr
                      key={tx._id}
                      className="hover:bg-gradient-to-r hover:from-emerald-50/60 hover:via-sky-50/40 hover:to-violet-50/50 transition-colors"
                    >
                      <td className="p-4 pl-6 font-semibold text-gray-900">{tx.vendorId?.businessName || tx.vendorId?.name || 'Vendor'}</td>
                      <td className="p-4 text-gray-500">{tx.vendorId?.email}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 ring-1 ring-amber-200 uppercase">
                          ★ {tx.plan}
                        </span>
                      </td>
                      <td className="p-4 font-bold font-serif text-sm text-gradient-gold">
                        {formatCurrency(tx.amount, tx.currency)}
                      </td>
                      <td className="p-4 font-mono text-[11px] text-sky-600 truncate max-w-[150px]">
                        {tx.stripeSessionId}
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200 uppercase">
                          <CheckCircle2 className="w-3 h-3" />
                          {tx.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-gray-500">{formatDate(tx.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
