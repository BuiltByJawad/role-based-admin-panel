import type { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "./auth.js";
import { HttpError } from "./errorHandler.js";

export const requireRole = (role: "ADMIN") => {
  return (request: AuthenticatedRequest, _response: Response, next: NextFunction): void => {
    if (!request.auth) {
      throw new HttpError("Unauthorized", 401);
    }

    if (request.auth.role !== role) {
      throw new HttpError("Forbidden", 403);
    }

    next();
  };
};
