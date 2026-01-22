import { apiFetch } from "./client";

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  status: "ACTIVE" | "ARCHIVED" | "DELETED";
  isDeleted: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  creator?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ProjectsResponse {
  data: ProjectItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export const fetchProjects = (token: string, page = 1, limit = 50, search?: string) => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search) params.append("search", search);
  return apiFetch<ProjectsResponse>(`/projects?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createProject = (token: string, payload: { name: string; description: string }) =>
  apiFetch<ProjectItem>("/projects", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

export const updateProject = (
  token: string,
  id: string,
  payload: { name?: string; description?: string; status?: "ACTIVE" | "ARCHIVED" }
) =>
  apiFetch<ProjectItem>(`/projects/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

export const deleteProject = (token: string, id: string) =>
  apiFetch<ProjectItem>(`/projects/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
