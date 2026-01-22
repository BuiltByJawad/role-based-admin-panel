import { prisma } from "../db/prisma.js";
import { HttpError } from "../middleware/errorHandler.js";
import { toProjectResponse } from "../dto/projectDto.js";
import { logAudit } from "./auditService.js";

interface CreateProjectInput {
  name: string;
  description: string;
  createdBy: string;
  ipAddress?: string;
}

interface UpdateProjectInput {
  id: string;
  name?: string;
  description?: string;
  status?: "ACTIVE" | "ARCHIVED";
  updatedBy?: string;
  ipAddress?: string;
}

interface ListProjectsOptions {
  search?: string;
}

const parsePagination = (page?: string, limit?: string) => {
  const safePage = Math.max(Number(page ?? 1), 1);
  const safeLimit = Math.min(Math.max(Number(limit ?? 50), 1), 100);
  const skip = (safePage - 1) * safeLimit;

  return { safePage, safeLimit, skip };
};

export const createProject = async ({ name, description, createdBy, ipAddress }: CreateProjectInput) => {
  const project = await prisma.project.create({
    data: {
      name,
      description,
      createdBy,
    },
  });

  await logAudit({
    action: "PROJECT_CREATED",
    userId: createdBy,
    targetId: project.id,
    details: `Project "${name}" created`,
    ipAddress,
  });

  return toProjectResponse(project);
};

export const listProjects = async (page?: string, limit?: string, options?: ListProjectsOptions) => {
  const { safePage, safeLimit, skip } = parsePagination(page, limit);
  const where = {
    isDeleted: false,
    ...(options?.search && {
      OR: [
        { name: { contains: options.search, mode: "insensitive" as const } },
        { description: { contains: options.search, mode: "insensitive" as const } },
      ],
    }),
  };

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      skip,
      take: safeLimit,
      orderBy: { createdAt: "desc" },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.project.count({ where }),
  ]);

  return {
    data: projects.map((project: (typeof projects)[number]) => toProjectResponse(project)),
    meta: {
      page: safePage,
      limit: safeLimit,
      total,
    },
  };
};

export const updateProject = async ({ id, name, description, status, updatedBy, ipAddress }: UpdateProjectInput) => {
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project || project.isDeleted) {
    throw new HttpError("Project not found", 404);
  }

  const updated = await prisma.project.update({
    where: { id },
    data: {
      name,
      description,
      status,
    },
  });

  await logAudit({
    action: "PROJECT_UPDATED",
    userId: updatedBy,
    targetId: id,
    details: `Project updated`,
    ipAddress,
  });

  return toProjectResponse(updated);
};

export const softDeleteProject = async (id: string, deletedBy?: string, ipAddress?: string) => {
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project || project.isDeleted) {
    throw new HttpError("Project not found", 404);
  }

  const updated = await prisma.project.update({
    where: { id },
    data: {
      isDeleted: true,
      status: "DELETED",
    },
  });

  await logAudit({
    action: "PROJECT_DELETED",
    userId: deletedBy,
    targetId: id,
    details: `Project "${project.name}" soft deleted`,
    ipAddress,
  });

  return toProjectResponse(updated);
};
