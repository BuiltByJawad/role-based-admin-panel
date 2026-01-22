import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authenticate } from "../middleware/auth.js";
import { ensureActiveUser } from "../middleware/ensureActiveUser.js";
import { getDashboardStats } from "../services/statsService.js";

export const statsRouter = Router();

statsRouter.get(
    "/dashboard",
    authenticate,
    asyncHandler(ensureActiveUser),
    asyncHandler(async (_request, response) => {
        const stats = await getDashboardStats();
        response.json(stats);
    })
);
