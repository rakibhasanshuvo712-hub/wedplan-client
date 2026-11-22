'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export function RoleGuard({
  children,
  allowedRoles,
  redirectTo = '/signin',
}: RoleGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !user) {
        router.replace(`${redirectTo}?from=${encodeURIComponent(window.location.pathname)}`);
        return;
      }

      if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        // Redirect user to their own correct dashboard if role mismatches
        switch (user.role) {
          case 'admin':
            router.replace('/dashboard/admin');
            break;
          case 'vendor':
            router.replace('/dashboard/vendor');
            break;
          case 'customer':
          default:
            router.replace('/dashboard/customer');
            break;
        }
      }
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, router, redirectTo]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-gray-500">Verifying security credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
