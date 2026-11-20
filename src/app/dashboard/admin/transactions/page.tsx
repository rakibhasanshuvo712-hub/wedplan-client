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
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-950">
              Platform Financial Transactions
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Read-only Stripe transaction ledger. Payments are verified through Stripe Webhooks.
            </p>
          </div>
          <div className="px-4 py-2 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            Total Revenue: <strong>{formatCurrency(totalVolume)}</strong>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 uppercase tracking-wider font-semibold">
                  <th className="p-4 pl-6">Vendor Name</th>
                  <th className="p-4">Business Email</th>
                  <th className="p-4">Subscription Plan</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Stripe Session ID</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
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
                    <td colSpan={7} className="p-12 text-center text-gray-500">
                      No platform transactions recorded yet.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx._id} className="hover:bg-rose-50/20 transition-colors">
                      <td className="p-4 pl-6 font-semibold text-gray-900">
                        {tx.vendorId?.businessName || tx.vendorId?.name || 'Vendor'}
                      </td>
                      <td className="p-4 text-gray-500">{tx.vendorId?.email}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-amber-100 text-amber-800 uppercase">
                          ★ {tx.plan}
                        </span>
                      </td>
                      <td className="p-4 font-bold font-serif text-sm text-emerald-700">
                        {formatCurrency(tx.amount, tx.currency)}
                      </td>
                      <td className="p-4 font-mono text-[11px] text-gray-500 truncate max-w-[150px]">
                        {tx.stripeSessionId}
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800 uppercase">
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
