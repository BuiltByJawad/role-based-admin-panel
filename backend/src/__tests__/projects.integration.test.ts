import request from "supertest";
import { beforeAll, describe, expect, it, vi } from "vitest";
import type { Express } from "express";

let app: Express;

vi.mock("../services/projectService.js", async () => {
  const actual = await vi.importActual<typeof import("../services/projectService.js")>(
    "../services/projectService.js"
  );

  return {
    ...actual,
    createProject: vi.fn(async (_input) => ({
      id: "project-1",
      name: "Project Alpha",
      description: "First project",
      status: "ACTIVE" as const,
      createdBy: "user-1",
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    })),
    listProjects: vi.fn(async (_page, _limit, _options) => ({
      data: [
        {
          id: "project-1",
          name: "Project Alpha",
          description: "First project",
          status: "ACTIVE" as const,
          createdBy: "user-1",
          createdAt: new Date(),
          updatedAt: new Date(),
          isDeleted: false,
        },
      ],
      meta: {
        page: 1,
        limit: 50,
        total: 1,
      },
    })),
    updateProject: vi.fn(async (_input) => ({
      id: "project-1",
      name: "Project Alpha Updated",
      description: "Updated",
      status: "ARCHIVED" as const,
      createdBy: "user-1",
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    })),
    softDeleteProject: vi.fn(async (_id, _deletedBy, _ipAddress) => ({
      id: "project-1",
      name: "Project Alpha",
      description: "First project",
      status: "DELETED" as const,
      createdBy: "user-1",
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: true,
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

const TEST_PROJECT_ID = "22222222-2222-2222-2222-222222222222";
const AUTH_HEADER = { Authorization: "Bearer test-token" };

describe("Project routes", () => {
  beforeAll(async () => {
    vi.resetModules();
    ({ app } = await import("../app.js"));
  });

  it("creates a project", async () => {
    const response = await request(app)
      .post("/projects")
      .set(AUTH_HEADER)
      .send({
        name: "Project Alpha",
        description: "First project",
      });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe("Project Alpha");
  });

  it("lists projects", async () => {
    const response = await request(app).get("/projects").set(AUTH_HEADER);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
  });

  it("updates a project", async () => {
    const response = await request(app)
      .patch(`/projects/${TEST_PROJECT_ID}`)
      .set(AUTH_HEADER)
      .send({ name: "Project Alpha Updated", description: "Updated", status: "ARCHIVED" });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ARCHIVED");
  });

  it("soft deletes a project", async () => {
    const response = await request(app)
      .delete(`/projects/${TEST_PROJECT_ID}`)
      .set(AUTH_HEADER);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("DELETED");
  });
});
