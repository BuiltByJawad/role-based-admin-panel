import request from "supertest";
import { beforeAll, describe, expect, it, vi } from "vitest";
import type { Express } from "express";

let app: Express;

vi.mock("../services/userService.js", async () => {
  const actual = await vi.importActual<typeof import("../services/userService.js")>(
    "../services/userService.js"
  );

  return {
    ...actual,
    listUsers: vi.fn(async () => ({
      data: [
        {
          id: "user-1",
          name: "Admin User",
          email: "admin@example.com",
          role: "ADMIN" as const,
          status: "ACTIVE" as const,
        },
      ],
      meta: { total: 1, page: 1, limit: 10 },
    })),
    updateUserRole: vi.fn(async () => ({
      id: "user-1",
      name: "Admin User",
      email: "admin@example.com",
      role: "MANAGER" as const,
      status: "ACTIVE" as const,
    })),
    updateUserStatus: vi.fn(async () => ({
      id: "user-1",
      name: "Admin User",
      email: "admin@example.com",
      role: "ADMIN" as const,
      status: "INACTIVE" as const,
    })),
  } satisfies Partial<typeof actual>;
});

vi.mock("../middleware/auth.js", () => ({
  authenticate: (request: { auth?: { userId: string; role: "ADMIN" } }, _response: unknown, next: () => void) => {
    request.auth = { userId: "user-1", role: "ADMIN" };
    next();
  },
  requireAuth: (request: { auth?: { userId: string; role: "ADMIN" } }) => {
    return request.auth ?? { userId: "user-1", role: "ADMIN" };
  },
}));

vi.mock("../middleware/ensureActiveUser.js", () => ({
  ensureActiveUser: async (_request: unknown, _response: unknown, next: () => void) => {
    next();
  },
}));

vi.mock("../middleware/requireRole.js", () => ({
  requireRole: () => (_request: unknown, _response: unknown, next: () => void) => next(),
}));

vi.mock("../middleware/validate.js", () => ({
  validate: () => (_request: unknown, _response: unknown, next: () => void) => next(),
}));

const TEST_USER_ID = "11111111-1111-1111-1111-111111111111";
const AUTH_HEADER = { Authorization: "Bearer test-token" };

describe("User routes", () => {
  beforeAll(async () => {
    vi.resetModules();
    ({ app } = await import("../app.js"));
  });

  it("lists users", async () => {
    const response = await request(app)
      .get("/users")
      .set(AUTH_HEADER)
      .query({ page: "1", limit: "10" });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.meta.total).toBe(1);
  });

  it("updates a user role", async () => {
    const response = await request(app)
      .patch(`/users/${TEST_USER_ID}/role`)
      .set(AUTH_HEADER)
      .send({ role: "MANAGER" });

    expect(response.status).toBe(200);
    expect(response.body.role).toBe("MANAGER");
  });

  it("updates a user status", async () => {
    const response = await request(app)
      .patch(`/users/${TEST_USER_ID}/status`)
      .set(AUTH_HEADER)
      .send({ status: "INACTIVE" });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("INACTIVE");
  });
});
