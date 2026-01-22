import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchDashboardStats, type DashboardStats } from "../api/statsApi";
import { useAppSelector } from "../store/hooks";

const DASHBOARD_STATS_CACHE_KEY = "dashboardStatsCache";

const readCachedStats = (): DashboardStats | null => {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(DASHBOARD_STATS_CACHE_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw) as DashboardStats;
    } catch {
        return null;
    }
};

const writeCachedStats = (stats: DashboardStats) => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(DASHBOARD_STATS_CACHE_KEY, JSON.stringify(stats));
};

export const useDashboardStats = () => {
    const token = useAppSelector((state) => state.auth.token);

    const cachedStats = readCachedStats();

    const query = useQuery({
        queryKey: ["dashboard-stats"],
        queryFn: () => fetchDashboardStats(token!),
        enabled: !!token,
        initialData: () => cachedStats ?? undefined,
        initialDataUpdatedAt: cachedStats ? Date.now() : undefined,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 15,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        refetchInterval: 1000 * 30,
    });

    useEffect(() => {
        if (query.data) {
            writeCachedStats(query.data);
        }
    }, [query.data]);

    return query;
};
