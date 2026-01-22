import { prisma } from "../db/prisma.js";

export interface DashboardStats {
    users: number;
    projects: number;
    pendingInvites: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
    const [users, projects, pendingInvites] = await Promise.all([
        prisma.user.count({ where: { status: "ACTIVE" } }),
        prisma.project.count({ where: { isDeleted: false } }),
        prisma.invite.count({ where: { acceptedAt: null, expiresAt: { gt: new Date() } } }),
    ]);

    return { users, projects, pendingInvites };
};
