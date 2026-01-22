import crypto from "crypto";
import { prisma } from "../db/prisma.js";
import { env } from "../config/env.js";
import { HttpError } from "../middleware/errorHandler.js";
import { signToken } from "../utils/jwt.js";
import { toUserResponse } from "../dto/userDto.js";

const REFRESH_TOKEN_EXPIRY_DAYS = 7;

const generateRefreshToken = (): string => {
    return crypto.randomBytes(64).toString("hex");
};

export const createRefreshToken = async (userId: string): Promise<string> => {
    const token = generateRefreshToken();
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

    await prisma.refreshToken.create({
        data: {
            token,
            userId,
            expiresAt,
        },
    });

    return token;
};

export const refreshAccessToken = async (refreshToken: string) => {
    const tokenRecord = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
    });

    if (!tokenRecord) {
        throw new HttpError("Invalid refresh token", 401);
    }

    if (tokenRecord.expiresAt < new Date()) {
        await prisma.refreshToken.delete({ where: { id: tokenRecord.id } });
        throw new HttpError("Refresh token expired", 401);
    }

    if (tokenRecord.user.status !== "ACTIVE") {
        throw new HttpError("User is inactive", 403);
    }

    // Rotate refresh token for security
    await prisma.refreshToken.delete({ where: { id: tokenRecord.id } });
    const newRefreshToken = await createRefreshToken(tokenRecord.userId);

    const accessToken = signToken({
        userId: tokenRecord.userId,
        role: tokenRecord.user.role,
    });

    return {
        token: accessToken,
        refreshToken: newRefreshToken,
        user: toUserResponse(tokenRecord.user),
    };
};

export const revokeRefreshToken = async (refreshToken: string): Promise<void> => {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
};

export const revokeAllUserTokens = async (userId: string): Promise<void> => {
    await prisma.refreshToken.deleteMany({ where: { userId } });
};
