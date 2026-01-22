import { apiFetch } from "./client";

export interface DashboardStats {
    users: number;
    projects: number;
    pendingInvites: number;
}

export const fetchDashboardStats = async (token: string): Promise<DashboardStats> => {
    return apiFetch<DashboardStats>("/stats/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
    });
};
