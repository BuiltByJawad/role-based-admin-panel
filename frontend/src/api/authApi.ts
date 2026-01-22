import { apiFetch } from "./client";
import type { AuthUser } from "../store/slices/authSlice";

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface InviteResponse {
  id: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "STAFF";
  token: string;
  expiresAt: string;
}

export const login = (payload: { email: string; password: string }) =>
  apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const registerViaInvite = (payload: { token: string; name: string; password: string }) =>
  apiFetch<LoginResponse>("/auth/register-via-invite", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const createInvite = (payload: { email: string; role: "ADMIN" | "MANAGER" | "STAFF" }, token: string) =>
  apiFetch<InviteResponse>("/auth/invite", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
