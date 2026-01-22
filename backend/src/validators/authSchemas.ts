import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const inviteSchema = z.object({
  body: z.object({
    email: z.string().email(),
    role: z.enum(["ADMIN", "MANAGER", "STAFF"]).optional(),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const registerViaInviteSchema = z.object({
  body: z.object({
    token: z.string().min(10),
    name: z.string().min(2),
    password: z.string().min(8),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(10),
  }),
  params: z.object({}),
  query: z.object({}),
});
