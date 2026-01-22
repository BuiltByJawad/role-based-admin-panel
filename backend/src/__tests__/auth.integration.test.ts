import request from "supertest";
import { beforeAll, describe, expect, it, vi } from "vitest";
import type { Express } from "express";

let app: Express;

vi.mock("../services/authService.js", async () => {
  const actual = await vi.importActual<typeof import("../services/authService.js")>(
    "../services/authService.js"
  );

  return {
    ...actual,
    loginUser: vi.fn(async (_input, _ipAddress) => ({
      user: {
        id: "user-1",
        name: "Admin User",
        email: "admin@example.com",
        role: "ADMIN" as const,
        status: "ACTIVE" as const,
      },
      token: "test-token",
      refreshToken: "refresh-token",
    })),
    registerViaInvite: vi.fn(async (_input, _ipAddress) => ({
      user: {
        id: "user-2",
        name: "Invited User",
        email: "invited@example.com",
        role: "STAFF" as const,
        status: "ACTIVE" as const,
      },
      token: "invite-token",
      refreshToken: "invite-refresh-token",
    })),
    createInvite: vi.fn(async (_input, _ipAddress) => ({
      id: "invite-1",
      email: "staff@example.com",
      role: "STAFF" as const,
      token: "invite-token-123",
      expiresAt: new Date(),
    })),
  } satisfies Partial<typeof actual>;
});

vi.mock("../middleware/auth.js", () => ({
  authenticate: (request: any, _response: any, next: any) => {
    request.auth = { userId: "user-1", role: "ADMIN" as const };
    next();
  },
  requireAuth: (request: any) => {
    return request.auth ?? { userId: "user-1", role: "ADMIN" as const };
  },
}));

vi.mock("../middleware/ensureActiveUser.js", () => ({
  ensureActiveUser: async (_request: any, _response: any, next: any) => {
    next();
  },
}));

vi.mock("../middleware/requireRole.js", () => ({
  requireRole: () => (_request: any, _response: any, next: any) => next(),
}));

vi.mock("../middleware/validate.js", () => ({
  validate: () => (_request: any, _response: any, next: any) => next(),
}));

describe("Auth routes", () => {
  beforeAll(async () => {
    vi.resetModules();
    ({ app } = await import("../app.js"));
  });

  it("responds to health check", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });

  it("logs in a user", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "admin@example.com",
      password: "Admin123!",
    });

    expect(response.status).toBe(200);
    expect(response.body.user.email).toBe("admin@example.com");
    expect(response.body.token).toBe("test-token");
  });

  it("registers a user via invite", async () => {
    const response = await request(app).post("/auth/register-via-invite").send({
      name: "Invited User",
      email: "invited@example.com",
      password: "Secure123!",
      token: "invite-token-123",
    });

    expect(response.status).toBe(201);
    expect(response.body.user.email).toBe("invited@example.com");
    expect(response.body.token).toBe("invite-token");
  });

  it("creates an invite", async () => {
    const response = await request(app)
      .post("/auth/invite")
      .set("Authorization", "Bearer test-token")
      .send({ email: "staff@example.com", role: "STAFF" });

    expect(response.status).toBe(201);
    expect(response.body.email).toBe("staff@example.com");
    expect(response.body.token).toBe("invite-token-123");
  });
});
