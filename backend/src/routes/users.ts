import { Router, type Request } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import { authenticate, type AuthenticatedRequest } from "../middleware/auth.js";
import { ensureActiveUser } from "../middleware/ensureActiveUser.js";
import { requireRole } from "../middleware/requireRole.js";
import {
  listUsersSchema,
  updateUserRoleSchema,
  updateUserStatusSchema,
} from "../validators/userSchemas.js";
import { listUsers, updateUserRole, updateUserStatus } from "../services/userService.js";

export const usersRouter = Router();

const getClientIp = (request: any): string | undefined => {
  return request.headers["x-forwarded-for"]?.split(",")[0] || request.socket?.remoteAddress;
};

usersRouter.get(
  "/",
  authenticate,
  asyncHandler(ensureActiveUser),
  requireRole("ADMIN"),
  validate(listUsersSchema),
  asyncHandler(async (request: Request<{}, {}, {}, { page?: string; limit?: string; search?: string }>, response) => {
    const result = await listUsers(
      request.query.page,
      request.query.limit,
      { search: request.query.search }
    );
    response.json(result);
  })
);

usersRouter.patch(
  "/:id/role",
  authenticate,
  asyncHandler(ensureActiveUser),
  requireRole("ADMIN"),
  validate(updateUserRoleSchema),
  asyncHandler(async (request: AuthenticatedRequest, response) => {
    const user = await updateUserRole(
      request.params.id,
      request.body.role,
      request.auth?.userId,
      getClientIp(request)
    );
    response.json(user);
  })
);

usersRouter.patch(
  "/:id/status",
  authenticate,
  asyncHandler(ensureActiveUser),
  requireRole("ADMIN"),
  validate(updateUserStatusSchema),
  asyncHandler(async (request: AuthenticatedRequest, response) => {
    const user = await updateUserStatus(
      request.params.id,
      request.body.status,
      request.auth?.userId,
      getClientIp(request)
    );
    response.json(user);
  })
);
