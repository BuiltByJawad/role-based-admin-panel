import { useDashboardStats } from "../../hooks/useDashboardStats";
import { MetricsGrid } from "./components/MetricsGrid";

export const DashboardPage = () => {
    const { data: stats, isLoading } = useDashboardStats();

    return <MetricsGrid isLoading={isLoading} stats={stats ?? null} />;
};
