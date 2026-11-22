import { cn } from '@/lib/utils';

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-xl bg-gradient-to-r from-red-100 via-red-100 to-red-100 bg-[length:200%_100%] animate-[shimmer_2s_linear_infinite]',
        className
      )}
      {...props}
    />
  );
}
