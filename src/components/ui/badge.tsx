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
    default: 'bg-gradient-to-r from-red-100 to-red-100 text-red-800 border-red-200',
    success: 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border-emerald-200',
    warning: 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-amber-200',
    danger: 'bg-gradient-to-r from-red-100 to-red-100 text-red-800 border-red-200',
    purple: 'bg-gradient-to-r from-violet-100 to-red-100 text-purple-800 border-purple-200',
    outline: 'border border-red-200 text-red-700 bg-gradient-to-r from-white to-red-50/50',
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
