const configuredApiBase = `${import.meta.env.VITE_API_URL || ""}`.trim();
const API_BASE = configuredApiBase || (import.meta.env.DEV ? "http://localhost:4000" : "");

export const AUTH_TOKEN_KEY = "sorting_visualizer_auth_token";

export function getAuthToken() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(AUTH_TOKEN_KEY) || "";
}

export function setAuthToken(token) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
}

export function clearAuthToken() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

export async function request(path, options = {}) {
  const shouldAttachAuth = options.attachAuth !== false;
  const token = getAuthToken();
  const requestUrl = API_BASE ? `${API_BASE}${path}` : path;

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (shouldAttachAuth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(requestUrl, {
    ...options,
    headers,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(data?.error || "API request failed");
    error.status = response.status;
    throw error;
  }

  return data;
}