import type { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "./auth.js";
import { prisma } from "../db/prisma.js";
import { HttpError } from "./errorHandler.js";

export const ensureActiveUser = async (
  request: AuthenticatedRequest,
  _response: Response,
  next: NextFunction
): Promise<void> => {
  if (!request.auth) {
    throw new HttpError("Unauthorized", 401);
  }

  const user = await prisma.user.findUnique({ where: { id: request.auth.userId } });
  if (!user) {
    throw new HttpError("Unauthorized", 401);
  }

  if (user.status !== "ACTIVE") {
    throw new HttpError("User is inactive", 403);
  }

  next();
};
