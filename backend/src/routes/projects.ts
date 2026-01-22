import { Router, type Request } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import { authenticate, requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";
import { ensureActiveUser } from "../middleware/ensureActiveUser.js";
import { requireRole } from "../middleware/requireRole.js";
import {
  createProjectSchema,
  deleteProjectSchema,
  listProjectsSchema,
  updateProjectSchema,
} from "../validators/projectSchemas.js";
import {
  createProject,
  listProjects,
  softDeleteProject,
  updateProject,
} from "../services/projectService.js";

export const projectsRouter = Router();

const getClientIp = (request: any): string | undefined => {
  return request.headers["x-forwarded-for"]?.split(",")[0] || request.socket?.remoteAddress;
};

projectsRouter.post(
  "/",
  authenticate,
  asyncHandler(ensureActiveUser),
  validate(createProjectSchema),
  asyncHandler(async (request: AuthenticatedRequest, response) => {
    const auth = requireAuth(request);
    const result = await createProject({
      name: request.body.name,
      description: request.body.description,
      createdBy: auth.userId,
      ipAddress: getClientIp(request),
    });
    response.status(201).json(result);
  })
);

projectsRouter.get(
  "/",
  authenticate,
  asyncHandler(ensureActiveUser),
  validate(listProjectsSchema),
  asyncHandler(async (request: Request<{}, {}, {}, { page?: string; limit?: string; search?: string }>, response) => {
    const result = await listProjects(request.query.page, request.query.limit, { search: request.query.search });
    response.json(result);
  })
);

projectsRouter.patch(
  "/:id",
  authenticate,
  asyncHandler(ensureActiveUser),
  requireRole("ADMIN"),
  validate(updateProjectSchema),
  asyncHandler(async (request: AuthenticatedRequest, response) => {
    const result = await updateProject({
      id: request.params.id,
      name: request.body.name,
      description: request.body.description,
      status: request.body.status,
      updatedBy: request.auth?.userId,
      ipAddress: getClientIp(request),
    });
    response.json(result);
  })
);

projectsRouter.delete(
  "/:id",
  authenticate,
  asyncHandler(ensureActiveUser),
  requireRole("ADMIN"),
  validate(deleteProjectSchema),
  asyncHandler(async (request: AuthenticatedRequest, response) => {
    const result = await softDeleteProject(
      request.params.id,
      request.auth?.userId,
      getClientIp(request)
    );
    response.json(result);
  })
);
