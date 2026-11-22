import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'outline' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] cursor-pointer';

    const variants = {
      default:
        'bg-gradient-to-r from-rose-600 to-pink-600 text-white hover:from-rose-700 hover:to-pink-700 shadow-sm hover:shadow-md hover:shadow-rose-500/25 focus:ring-rose-500',
      primary:
        'bg-gradient-to-r from-rose-600 via-fuchsia-600 to-pink-600 text-white hover:from-rose-700 hover:via-fuchsia-700 hover:to-pink-700 shadow-md shadow-rose-500/25 hover:shadow-lg hover:shadow-fuchsia-500/30 focus:ring-rose-500',
      outline:
        'border border-rose-200 bg-white text-rose-950 hover:bg-gradient-to-r hover:from-rose-50 hover:to-fuchsia-50 hover:border-fuchsia-300 focus:ring-fuchsia-400',
      secondary:
        'bg-gradient-to-r from-rose-50 to-fuchsia-50 text-rose-700 hover:from-rose-100 hover:to-fuchsia-100 hover:text-fuchsia-800 focus:ring-fuchsia-400',
      ghost:
        'text-slate-600 hover:bg-gradient-to-r hover:from-rose-50 hover:to-fuchsia-50 hover:text-fuchsia-700 focus:ring-fuchsia-400',
      danger:
        'bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700 focus:ring-red-500 shadow-sm shadow-red-500/20',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 h-8 gap-1.5',
      md: 'text-sm px-4 py-2.5 h-10 gap-2',
      lg: 'text-base px-6 py-3.5 h-12 gap-2.5 font-semibold',
      icon: 'h-10 w-10 p-0',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Loading...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
