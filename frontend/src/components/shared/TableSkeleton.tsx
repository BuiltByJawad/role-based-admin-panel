import { memo } from "react";

interface TableSkeletonProps {
    rows?: number;
    columns?: number;
}

export const TableSkeleton = memo(({ rows = 6, columns = 4 }: TableSkeletonProps) => {
    return (
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200/70 bg-white/80 shadow-sm shadow-slate-200/60 backdrop-blur dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-none">
            <div className="grid gap-0.5 bg-slate-100/80 px-4 py-3 text-xs uppercase tracking-[0.2em] text-slate-500 dark:bg-slate-900/80 dark:text-slate-400">
                <div className="h-4 w-32 rounded-full bg-slate-200/80 dark:bg-slate-800/80" />
            </div>
            <div className="divide-y divide-slate-200/70 dark:divide-slate-800">
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <div key={`skeleton-row-${rowIndex}`} className="grid grid-cols-1 gap-4 px-4 py-3 sm:grid-cols-2 lg:grid-cols-4">
                        {Array.from({ length: columns }).map((__, columnIndex) => (
                            <div
                                key={`skeleton-cell-${rowIndex}-${columnIndex}`}
                                className="h-4 w-full animate-pulse rounded-full bg-slate-200/80 dark:bg-slate-800/80"
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
});

TableSkeleton.displayName = "TableSkeleton";
