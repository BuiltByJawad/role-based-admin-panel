import { prisma } from "../db/prisma.js";
import { HttpError } from "../middleware/errorHandler.js";
import { toUserResponse } from "../dto/userDto.js";
import { logAudit } from "./auditService.js";

const parsePagination = (page?: string, limit?: string) => {
  const safePage = Math.max(Number(page ?? 1), 1);
  const safeLimit = Math.min(Math.max(Number(limit ?? 50), 1), 100);
  const skip = (safePage - 1) * safeLimit;

  return { safePage, safeLimit, skip };
};

interface ListUsersOptions {
  search?: string;
}

export const listUsers = async (page?: string, limit?: string, options?: ListUsersOptions) => {
  const { safePage, safeLimit, skip } = parsePagination(page, limit);
  const where = options?.search
    ? {
      OR: [
        { name: { contains: options.search, mode: "insensitive" as const } },
        { email: { contains: options.search, mode: "insensitive" as const } },
      ],
    }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: safeLimit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        invitedAt: true,
        createdAt: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    data: users.map((user: (typeof users)[number]) => toUserResponse(user)),
    meta: {
      page: safePage,
      limit: safeLimit,
      total,
    },
  };
};

export const updateUserRole = async (
  id: string,
  role: "ADMIN" | "MANAGER" | "STAFF",
  updatedBy?: string,
  ipAddress?: string
) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new HttpError("User not found", 404);
  }

  const previousRole = user.role;
  const updated = await prisma.user.update({
    where: { id },
    data: { role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });

  await logAudit({
    action: "USER_ROLE_CHANGED",
    userId: updatedBy,
    targetId: id,
    details: `Role changed from ${previousRole} to ${role}`,
    ipAddress,
  });

  return toUserResponse(updated);
};

export const updateUserStatus = async (
  id: string,
  status: "ACTIVE" | "INACTIVE",
  updatedBy?: string,
  ipAddress?: string
) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new HttpError("User not found", 404);
  }

  const previousStatus = user.status;
  const updated = await prisma.user.update({
    where: { id },
    data: { status },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });

  await logAudit({
    action: "USER_STATUS_CHANGED",
    userId: updatedBy,
    targetId: id,
    details: `Status changed from ${previousStatus} to ${status}`,
    ipAddress,
  });

  return toUserResponse(updated);
};
