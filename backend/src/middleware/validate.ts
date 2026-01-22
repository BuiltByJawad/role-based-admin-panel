import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { HttpError } from "./errorHandler.js";

export const validate = (schema: ZodSchema) => {
  return (request: Request, _response: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: request.body,
      params: request.params,
      query: request.query,
    });

    if (!result.success) {
      throw new HttpError("Validation failed", 400);
    }

    request.body = result.data.body;
    request.params = result.data.params;
    request.query = result.data.query;

    next();
  };
};
