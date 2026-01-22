export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "STAFF";
  status: "ACTIVE" | "INACTIVE";
  invitedAt?: Date | null;
  createdAt?: Date;
}

interface UserInput {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "STAFF";
  status: "ACTIVE" | "INACTIVE";
  invitedAt?: Date | null;
  createdAt?: Date;
}

export const toUserResponse = (user: UserInput): UserResponse => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
  invitedAt: user.invitedAt,
  createdAt: user.createdAt,
});
