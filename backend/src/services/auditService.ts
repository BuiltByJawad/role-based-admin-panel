import { prisma } from "../db/prisma.js";
import type { AuditAction } from "@prisma/client";

interface AuditLogInput {
    action: AuditAction;
    userId?: string;
    targetId?: string;
    details?: string;
    ipAddress?: string;
}

export const logAudit = async (input: AuditLogInput): Promise<void> => {
    await prisma.auditLog.create({
        data: {
            action: input.action,
            userId: input.userId,
            targetId: input.targetId,
            details: input.details,
            ipAddress: input.ipAddress,
        },
    });
};

export const getAuditLogs = async (limit = 100, offset = 0) => {
    const [logs, total] = await Promise.all([
        prisma.auditLog.findMany({
            orderBy: { createdAt: "desc" },
            take: limit,
            skip: offset,
        }),
        prisma.auditLog.count(),
    ]);

    return { data: logs, meta: { total, limit, offset } };
};
