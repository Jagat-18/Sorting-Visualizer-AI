import {
  request,
  setAuthToken,
  clearAuthToken,
  getAuthToken,
} from "./apiClient";

export async function signupUser({ name, email, password }) {
  const data = await request("/api/auth/signup", {
    method: "POST",
    attachAuth: false,
    body: JSON.stringify({ name, email, password }),
  });

  if (data?.token) {
    setAuthToken(data.token);
  }

  return data;
}

export async function loginUser({ email, password }) {
  const data = await request("/api/auth/login", {
    method: "POST",
    attachAuth: false,
    body: JSON.stringify({ email, password }),
  });

  if (data?.token) {
    setAuthToken(data.token);
  }

  return data;
}

export async function loginWithGoogleCredential(credential) {
  const data = await request("/api/auth/google", {
    method: "POST",
    attachAuth: false,
    body: JSON.stringify({ credential }),
  });

  if (data?.token) {
    setAuthToken(data.token);
  }

  return data;
}

export async function fetchCurrentUser() {
  return request("/api/auth/me", {
    method: "GET",
  });
}

export async function logoutUser() {
  try {
    await request("/api/auth/logout", {
      method: "POST",
      body: JSON.stringify({}),
    });
  } finally {
    clearAuthToken();
  }
}

export async function fetchUsageStats() {
  return request("/api/usage", {
    method: "GET",
  });
}

export function hasStoredAuthToken() {
  return Boolean(getAuthToken());
}
