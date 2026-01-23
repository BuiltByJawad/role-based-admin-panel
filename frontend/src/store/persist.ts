import type { AuthState } from "./slices/authSlice";

const STORAGE_KEY = "rbac-auth";

export const loadAuthState = (): AuthState | undefined => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return undefined;
    }
    return JSON.parse(raw) as AuthState;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn("Failed to load auth state", error);
    return undefined;
  }
};

export const saveAuthState = (state: AuthState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn("Failed to save auth state", error);
  }
};

export const clearAuthState = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn("Failed to clear auth state", error);
  }
};
