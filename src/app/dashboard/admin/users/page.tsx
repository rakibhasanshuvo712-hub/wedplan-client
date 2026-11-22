'use client';

import React, { useEffect, useState } from 'react';
import { RoleGuard } from '@/components/common/RoleGuard';
import { User, UserRole } from '@/types';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Search, ShieldAlert, ShieldCheck, UserX, UserCheck, Filter } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function ManageUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [actionUserId, setActionUserId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users', {
        params: {
          search: search || undefined,
          role: roleFilter !== 'all' ? roleFilter : undefined,
        },
      });
      const list = res?.users || res?.data || [];
      setUsers(list);
    } catch (err: any) {
      toast.error('Failed to load users: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleToggleBlock = async (user: User) => {
    if (user._id === currentUser?._id) {
      toast.error('Administrators cannot block their own account.');
      return;
    }

    const action = user.isBlocked ? 'unblock' : 'block';
    if (!confirm(`Are you sure you want to ${action} user "${user.name}"?`)) return;

    setActionUserId(user._id);
    try {
      const res = await api.put(`/admin/users/${user._id}/block`);
      toast.success(res.message || `User ${action}ed successfully.`);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || `Failed to ${action} user.`);
    } finally {
      setActionUserId(null);
    }
  };

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="relative space-y-6">
        {/* Gradient Page Header */}
        <div className="relative overflow-hidden rounded-3xl border border-rose-100 bg-gradient-to-br from-rose-50 via-fuchsia-50 to-violet-50 p-5 sm:p-6 shadow-[0_18px_45px_-20px_rgba(190,24,93,0.45)]">
          <div className="aurora-orb absolute -top-16 -right-12 h-56 w-56 bg-fuchsia-300/40" />
          <div className="aurora-orb aurora-orb--slow absolute -bottom-24 left-1/4 h-48 w-48 bg-amber-300/30" />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-600 via-fuchsia-600 to-violet-600 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white shadow-lg shadow-fuchsia-500/30">
                <ShieldCheck className="h-3.5 w-3.5" /> Admin Control
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gradient-rose">
                Manage Registered Users
              </h1>
              <p className="text-xs sm:text-sm text-rose-900/60 mt-1">
                Search couples and vendors, inspect roles, and restrict platform access for compromised accounts.
              </p>
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="glass-card rounded-3xl p-5 border border-white/70 shadow-[0_12px_35px_-18px_rgba(217,70,239,0.5)] flex flex-col md:flex-row items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="flex-1 w-full max-w-md">
            <Input
              placeholder="Search user by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search className="w-4 h-4 text-fuchsia-400" />}
              className="bg-white/90 border-fuchsia-200 shadow-sm shadow-fuchsia-100 focus:border-fuchsia-400 focus:ring-fuchsia-400/30"
            />
          </form>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-md shadow-violet-400/30">
              <Filter className="w-4 h-4" />
            </div>
            <span className="text-xs text-violet-700 font-semibold">Filter Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="text-xs font-semibold text-violet-900 bg-white/90 border border-violet-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400 shadow-sm"
            >
              <option value="all">All Roles</option>
              <option value="customer">Customers</option>
              <option value="vendor">Vendors</option>
              <option value="admin">Administrators</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="glass-card rounded-3xl border border-white/70 shadow-[0_18px_50px_-24px_rgba(190,24,93,0.35)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-rose-100 bg-gradient-to-r from-rose-50/80 via-fuchsia-50/70 to-violet-50/80 text-rose-900/70 uppercase tracking-wider font-semibold">
                  <th className="p-4 pl-6">User / Business</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Subscription</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Registered</th>
                  <th className="p-4 pr-6 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-50 text-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center">
                      <div className="space-y-3">
                        {[1, 2, 3, 4].map((i) => (
                          <Skeleton key={i} className="h-10 w-full" />
                        ))}
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center gap-2">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-100 via-fuchsia-100 to-amber-100 text-fuchsia-500 shadow-inner">
                          <Search className="h-6 w-6" />
                        </div>
                        <p className="text-sm font-serif font-bold text-gradient-rose">No users found</p>
                        <p className="text-xs text-gray-500">
                          No registered users found matching the filter.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr
                      key={u._id}
                      className="hover:bg-gradient-to-r hover:from-rose-50/60 hover:via-fuchsia-50/40 hover:to-violet-50/50 transition-colors"
                    >
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          {u.image ? (
                            <img
                              src={u.image}
                              alt=""
                              className="w-8 h-8 rounded-full object-cover border border-rose-200"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-fuchsia-600 text-white flex items-center justify-center font-bold text-xs shadow-sm shadow-fuchsia-300/50">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900">{u.name}</p>
                            {u.businessName && (
                              <p className="text-[10px] text-violet-500 font-medium">
                                {u.businessName}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600 font-mono text-[11px]">{u.email}</td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] ring-1 ${
                            u.role === 'admin'
                              ? 'bg-violet-100 text-violet-700 ring-violet-200'
                              : u.role === 'vendor'
                              ? 'bg-amber-100 text-amber-800 ring-amber-200'
                              : 'bg-sky-100 text-sky-700 ring-sky-200'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4">
                        {u.role === 'vendor' ? (
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                              u.subscriptionPlan === 'premium'
                                ? 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 ring-1 ring-amber-200'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {u.subscriptionPlan === 'premium' ? '★ Premium' : 'Free'}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="p-4">
                        {u.isBlocked ? (
                          <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-gradient-to-r from-rose-100 to-red-100 text-red-700 ring-1 ring-red-200">
                            Blocked
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-gray-500">{formatDate(u.createdAt)}</td>
                      <td className="p-4 pr-6 text-right">
                        {u._id !== currentUser?._id ? (
                          <Button
                            size="sm"
                            variant={u.isBlocked ? 'secondary' : 'danger'}
                            isLoading={actionUserId === u._id}
                            onClick={() => handleToggleBlock(u)}
                            className={
                              u.isBlocked
                                ? 'text-[11px] h-8 border-0 bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/30 hover:from-emerald-600 hover:to-teal-600'
                                : 'text-[11px] h-8 border-0 bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-md shadow-red-500/30 hover:from-rose-700 hover:to-red-700'
                            }
                          >
                            {u.isBlocked ? (
                              <>
                                <UserCheck className="w-3.5 h-3.5 mr-1" /> Unblock
                              </>
                            ) : (
                              <>
                                <UserX className="w-3.5 h-3.5 mr-1" /> Block User
                              </>
                            )}
                          </Button>
                        ) : (
                          <span className="text-[10px] text-violet-400 italic font-semibold">Self</span>
                        )}
                      </td>
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
