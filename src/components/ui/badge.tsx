import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'purple' | 'outline';
}

export function Badge({
  className,
  variant = 'default',
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: 'bg-gradient-to-r from-rose-100 to-pink-100 text-rose-800 border-rose-200',
    success: 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border-emerald-200',
    warning: 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-amber-200',
    danger: 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200',
    purple: 'bg-gradient-to-r from-violet-100 to-fuchsia-100 text-purple-800 border-purple-200',
    outline: 'border border-rose-200 text-rose-700 bg-gradient-to-r from-white to-rose-50/50',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
