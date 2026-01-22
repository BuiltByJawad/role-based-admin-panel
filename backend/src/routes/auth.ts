import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import { authenticate, type AuthenticatedRequest } from "../middleware/auth.js";
import { ensureActiveUser } from "../middleware/ensureActiveUser.js";
import { requireRole } from "../middleware/requireRole.js";
import {
  inviteSchema,
  loginSchema,
  registerViaInviteSchema,
  refreshTokenSchema,
} from "../validators/authSchemas.js";
import { createInvite, loginUser, registerViaInvite } from "../services/authService.js";
import { refreshAccessToken, revokeRefreshToken } from "../services/tokenService.js";

export const authRouter = Router();

const getClientIp = (request: any): string | undefined => {
  return request.headers["x-forwarded-for"]?.split(",")[0] || request.socket?.remoteAddress;
};

authRouter.post(
  "/login",
  validate(loginSchema),
  asyncHandler(async (request, response) => {
    const result = await loginUser(request.body, getClientIp(request));
    response.json(result);
  })
);

authRouter.post(
  "/invite",
  authenticate,
  asyncHandler(ensureActiveUser),
  requireRole("ADMIN"),
  validate(inviteSchema),
  asyncHandler(async (request: AuthenticatedRequest, response) => {
    const role = request.body.role ?? "STAFF";
    const invite = await createInvite(
      { email: request.body.email, role, invitedBy: request.auth?.userId },
      getClientIp(request)
    );
    response.status(201).json(invite);
  })
);

authRouter.post(
  "/register-via-invite",
  validate(registerViaInviteSchema),
  asyncHandler(async (request, response) => {
    const result = await registerViaInvite(request.body, getClientIp(request));
    response.status(201).json(result);
  })
);

authRouter.post(
  "/refresh",
  validate(refreshTokenSchema),
  asyncHandler(async (request, response) => {
    const result = await refreshAccessToken(request.body.refreshToken);
    response.json(result);
  })
);

authRouter.post(
  "/logout",
  asyncHandler(async (request, response) => {
    const { refreshToken } = request.body;
    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }
    response.json({ message: "Logged out successfully" });
  })
);
