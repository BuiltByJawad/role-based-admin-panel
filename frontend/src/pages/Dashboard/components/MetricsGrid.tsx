import { MetricCard } from "../../../components/Dashboard/MetricCard";

interface MetricsGridProps {
    isLoading: boolean;
    stats: {
        users?: number | null;
        projects?: number | null;
        pendingInvites?: number | null;
    } | null;
}

export const MetricsGrid = ({ isLoading, stats }: MetricsGridProps) => (
    <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 content-transition">
        <MetricCard
            label="Users"
            value={stats?.users ?? null}
            description="Active team members."
            loading={isLoading}
        />
        <MetricCard
            label="Projects"
            value={stats?.projects ?? null}
            description="Running initiatives."
            loading={isLoading}
        />
        <MetricCard
            label="Invites"
            value={stats?.pendingInvites ?? null}
            description="Pending onboarding links."
            loading={isLoading}
        />
    </section>
);

export type { MetricsGridProps };
