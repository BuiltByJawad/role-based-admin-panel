import { memo } from "react";

interface MetricCardProps {
    label: string;
    value: number | null;
    description: string;
    loading?: boolean;
}

export const MetricCard = memo(({ label, value, description, loading }: MetricCardProps) => (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-300">{label}</p>
        <p className="mt-3 font-display text-3xl text-white">
            {loading ? (
                <span className="inline-block h-8 w-12 animate-pulse rounded bg-slate-700" />
            ) : (
                value ?? 0
            )}
        </p>
        <p className="mt-2 text-sm text-slate-300">{description}</p>
    </div>
));

MetricCard.displayName = "MetricCard";
