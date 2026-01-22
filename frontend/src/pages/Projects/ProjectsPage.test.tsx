import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProjectsPage } from "./ProjectsPage";

vi.mock("../../hooks/useProjects", () => ({
  useProjects: () => ({
    data: [
      {
        id: "project-1",
        name: "Project Alpha",
        description: "First project",
        status: "ACTIVE",
      },
    ],
    isLoading: false,
    error: null,
  }),
  useUpdateProject: () => ({
    isPending: false,
    mutate: vi.fn(),
    variables: null,
  }),
  useDeleteProject: () => ({
    isPending: false,
    mutate: vi.fn(),
    variables: null,
  }),
  useOptimisticProjectUpdate: () => ({
    optimisticUpdate: vi.fn(),
    optimisticDelete: vi.fn(),
  }),
}));

vi.mock("../../store/hooks", () => ({
  useAppSelector: () => "ADMIN",
}));

vi.mock("../../components/Projects/ProjectForm", () => ({
  ProjectForm: () => <div>Project Form</div>,
}));

vi.mock("../../components/Projects/ProjectCard", () => ({
  ProjectCard: ({ project }: { project: { id: string; name: string } }) => (
    <div>{project.name}</div>
  ),
}));

describe("ProjectsPage", () => {
  it("renders projects page content", () => {
    render(<ProjectsPage />);

    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("Project Form")).toBeInTheDocument();
    expect(screen.getByText("Project Alpha")).toBeInTheDocument();
  });
});
