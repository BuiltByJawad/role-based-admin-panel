import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { HttpError } from "./errorHandler.js";

export interface AuthPayload {
  userId: string;
  role: "ADMIN" | "MANAGER" | "STAFF";
}

export interface AuthenticatedRequest extends Request {
  auth?: AuthPayload;
}

export const authenticate = (
  request: AuthenticatedRequest,
  _response: Response,
  next: NextFunction
): void => {
  const header = request.headers.authorization;
  if (!header) {
    throw new HttpError("Unauthorized", 401);
  }

  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    throw new HttpError("Unauthorized", 401);
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret) as AuthPayload;
    request.auth = payload;
    next();
  } catch {
    throw new HttpError("Unauthorized", 401);
  }
};

export const requireAuth = (request: AuthenticatedRequest): AuthPayload => {
  if (!request.auth) {
    throw new HttpError("Unauthorized", 401);
  }

  return request.auth;
};
