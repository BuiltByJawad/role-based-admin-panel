import { useDashboardStats } from "../../hooks/useDashboardStats";
import { MetricCard } from "../../components/Dashboard/MetricCard";

export const DashboardPage = () => {
    const { data: stats, isLoading } = useDashboardStats();

    return (
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
};
