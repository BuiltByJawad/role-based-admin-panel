import request from "supertest";
import { beforeAll, describe, expect, it, vi } from "vitest";
import type { Express } from "express";

let app: Express;

vi.mock("../services/statsService.js", async () => {
  const actual = await vi.importActual<typeof import("../services/statsService.js")>(
    "../services/statsService.js"
  );

  return {
    ...actual,
    getDashboardStats: vi.fn(async () => ({
      users: 12,
      projects: 7,
      pendingInvites: 3,
    })),
  } satisfies Partial<typeof actual>;
});

vi.mock("../middleware/auth.js", async () => {
  const actual = await vi.importActual<typeof import("../middleware/auth.js")>(
    "../middleware/auth.js"
  );

  return {
    ...actual,
    authenticate: (_request: unknown, _response: unknown, next: () => void) => next(),
  };
});

vi.mock("../middleware/ensureActiveUser.js", async () => {
  const actual = await vi.importActual<typeof import("../middleware/ensureActiveUser.js")>(
    "../middleware/ensureActiveUser.js"
  );

  return {
    ...actual,
    ensureActiveUser: (_request: unknown, _response: unknown, next: () => void) => next(),
  };
});

describe("Stats routes", () => {
  beforeAll(async () => {
    ({ app } = await import("../app.js"));
  });

  it("returns dashboard stats", async () => {
    const response = await request(app).get("/stats/dashboard");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ users: 12, projects: 7, pendingInvites: 3 });
  });
});
