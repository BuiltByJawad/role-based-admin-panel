export interface ApiError {
  message: string;
}

const getBaseUrl = () => {
  const url = import.meta.env.VITE_API_URL as string | undefined;
  if (!url) {
    throw new Error("VITE_API_URL is required");
  }
  return url;
};

export const apiFetch = async <TResponse>(
  path: string,
  options: RequestInit = {}
): Promise<TResponse> => {
  const mergedHeaders = {
    "Content-Type": "application/json",
    ...(options.headers ?? {}),
  };

  const response = await fetch(`${getBaseUrl()}${path}`, {
    ...options,
    headers: mergedHeaders,
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => ({ message: "Request failed" }))) as ApiError;
    throw new Error(errorBody.message ?? "Request failed");
  }

  return response.json() as Promise<TResponse>;
};