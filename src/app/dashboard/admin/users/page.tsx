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
      if (res.data) {
        setUsers(res.data);
      }
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
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-950">
            Manage Registered Users
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Search couples and vendors, inspect roles, and restrict platform access for compromised accounts.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="flex-1 w-full max-w-md">
            <Input
              placeholder="Search user by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search className="w-4 h-4 text-gray-400" />}
            />
          </form>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500 font-medium">Filter Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none"
            >
              <option value="all">All Roles</option>
              <option value="customer">Customers</option>
              <option value="vendor">Vendors</option>
              <option value="admin">Administrators</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 uppercase tracking-wider font-semibold">
                  <th className="p-4 pl-6">User / Business</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Subscription</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Registered</th>
                  <th className="p-4 pr-6 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
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
                    <td colSpan={7} className="p-12 text-center text-gray-500">
                      No registered users found matching the filter.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u._id} className="hover:bg-rose-50/20 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          {u.image ? (
                            <img
                              src={u.image}
                              alt=""
                              className="w-8 h-8 rounded-full object-cover border border-rose-200"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900">{u.name}</p>
                            {u.businessName && (
                              <p className="text-[10px] text-gray-500 font-medium">
                                {u.businessName}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600 font-mono text-[11px]">{u.email}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] bg-gray-100 text-gray-700">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4">
                        {u.role === 'vendor' ? (
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                              u.subscriptionPlan === 'premium'
                                ? 'bg-amber-100 text-amber-800'
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
                          <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-red-100 text-red-700">
                            Blocked
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-700">
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
                            className="text-[11px] h-8"
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
                          <span className="text-[10px] text-gray-400 italic">Self</span>
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
