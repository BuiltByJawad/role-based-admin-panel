import { memo } from "react";

interface MetricCardProps {
    label: string;
    value: number | null;
    description: string;
    loading?: boolean;
}

export const MetricCard = memo(({ label, value, description, loading }: MetricCardProps) => (
    <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 text-slate-900 shadow-sm shadow-slate-200/60 backdrop-blur dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-100 dark:shadow-none">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-slate-600 dark:text-slate-200">{label}</p>
        <p className="mt-3 font-display text-4xl font-semibold text-slate-900 dark:text-white">
            {loading ? (
                <span className="inline-block h-8 w-12 animate-pulse rounded bg-slate-300/80 dark:bg-slate-700" />
            ) : (
                value ?? 0
            )}
        </p>
        <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-300">{description}</p>
    </div>
));

MetricCard.displayName = "MetricCard";
