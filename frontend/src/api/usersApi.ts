import { apiFetch } from "./client";
import type { UserStatus, UserRole } from "../store/slices/authSlice";

export interface UserItem {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  invitedAt?: string | null;
  createdAt?: string;
}

export interface UsersResponse {
  data: UserItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export const fetchUsers = (token: string, page = 1, limit = 50, search?: string) => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search) params.append("search", search);
  return apiFetch<UsersResponse>(`/users?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateUserRole = (token: string, id: string, role: UserRole) =>
  apiFetch<UserItem>(`/users/${id}/role`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ role }),
  });

export const updateUserStatus = (token: string, id: string, status: UserStatus) =>
  apiFetch<UserItem>(`/users/${id}/status`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
