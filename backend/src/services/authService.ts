import crypto from "crypto";
import { prisma } from "../db/prisma.js";
import { env } from "../config/env.js";
import { HttpError } from "../middleware/errorHandler.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";
import { toInviteResponse } from "../dto/inviteDto.js";
import { toUserResponse } from "../dto/userDto.js";
import { createRefreshToken } from "./tokenService.js";
import { logAudit } from "./auditService.js";

interface LoginInput {
  email: string;
  password: string;
}

interface InviteInput {
  email: string;
  role: "ADMIN" | "MANAGER" | "STAFF";
  invitedBy?: string;
}

interface RegisterViaInviteInput {
  token: string;
  name: string;
  password: string;
}

const tokenLength = 32;

const generateToken = (): string => {
  return crypto.randomBytes(tokenLength).toString("hex");
};

export const loginUser = async ({ email, password }: LoginInput, ipAddress?: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new HttpError("Invalid credentials", 401);
  }

  if (user.status !== "ACTIVE") {
    throw new HttpError("User is inactive", 403);
  }

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    throw new HttpError("Invalid credentials", 401);
  }

  const token = signToken({ userId: user.id, role: user.role });
  const refreshToken = await createRefreshToken(user.id);

  await logAudit({
    action: "USER_LOGIN",
    userId: user.id,
    ipAddress,
  });

  return {
    token,
    refreshToken,
    user: toUserResponse(user),
  };
};

export const createInvite = async ({ email, role, invitedBy }: InviteInput, ipAddress?: string) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new HttpError("User already exists", 409);
  }

  const token = generateToken();
  const expiresAt = new Date(Date.now() + env.inviteExpiryHours * 60 * 60 * 1000);

  const invite = await prisma.invite.upsert({
    where: { email },
    update: {
      token,
      role,
      expiresAt,
      acceptedAt: null,
    },
    create: {
      email,
      role,
      token,
      expiresAt,
    },
  });

  await logAudit({
    action: "INVITE_CREATED",
    userId: invitedBy,
    targetId: invite.id,
    details: `Invited ${email} as ${role}`,
    ipAddress,
  });

  return toInviteResponse(invite);
};

export const registerViaInvite = async ({ token, name, password }: RegisterViaInviteInput, ipAddress?: string) => {
  const invite = await prisma.invite.findUnique({ where: { token } });
  if (!invite) {
    throw new HttpError("Invite not found", 404);
  }

  if (invite.acceptedAt) {
    throw new HttpError("Invite already used", 409);
  }

  if (invite.expiresAt < new Date()) {
    throw new HttpError("Invite expired", 410);
  }

  const existingUser = await prisma.user.findUnique({ where: { email: invite.email } });
  if (existingUser) {
    throw new HttpError("User already exists", 409);
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email: invite.email,
      password: hashedPassword,
      role: invite.role,
      status: "ACTIVE",
      invitedAt: invite.createdAt,
    },
  });

  await prisma.invite.update({
    where: { id: invite.id },
    data: { acceptedAt: new Date() },
  });

  const authToken = signToken({ userId: user.id, role: user.role });
  const refreshToken = await createRefreshToken(user.id);

  await logAudit({
    action: "USER_CREATED",
    userId: user.id,
    details: `User registered via invite`,
    ipAddress,
  });

  await logAudit({
    action: "INVITE_ACCEPTED",
    userId: user.id,
    targetId: invite.id,
    ipAddress,
  });

  return {
    token: authToken,
    refreshToken,
    user: toUserResponse(user),
  };
};
