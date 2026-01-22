export interface ProjectResponse {
  id: string;
  name: string;
  description: string;
  status: "ACTIVE" | "ARCHIVED" | "DELETED";
  isDeleted: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  creator?: {
    id: string;
    name: string;
    email: string;
  };
}

interface ProjectInput {
  id: string;
  name: string;
  description: string;
  status: "ACTIVE" | "ARCHIVED" | "DELETED";
  isDeleted: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  creator?: {
    id: string;
    name: string;
    email: string;
  };
}

export const toProjectResponse = (project: ProjectInput): ProjectResponse => ({
  id: project.id,
  name: project.name,
  description: project.description,
  status: project.status,
  isDeleted: project.isDeleted,
  createdBy: project.createdBy,
  createdAt: project.createdAt,
  updatedAt: project.updatedAt,
  creator: project.creator,
});
