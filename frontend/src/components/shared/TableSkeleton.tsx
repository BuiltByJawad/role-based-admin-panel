import { memo } from "react";

interface TableSkeletonProps {
    rows?: number;
    columns?: number;
}

export const TableSkeleton = memo(({ rows = 6, columns = 4 }: TableSkeletonProps) => {
    return (
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800">
            <div className="grid gap-0.5 bg-slate-900/80 px-4 py-3 text-xs uppercase tracking-[0.2em] text-slate-400">
                <div className="h-4 w-32 rounded-full bg-slate-800/80" />
            </div>
            <div className="divide-y divide-slate-800">
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <div key={`skeleton-row-${rowIndex}`} className="grid grid-cols-1 gap-4 px-4 py-3 sm:grid-cols-2 lg:grid-cols-4">
                        {Array.from({ length: columns }).map((__, columnIndex) => (
                            <div
                                key={`skeleton-cell-${rowIndex}-${columnIndex}`}
                                className="h-4 w-full animate-pulse rounded-full bg-slate-800/80"
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
});

TableSkeleton.displayName = "TableSkeleton";
