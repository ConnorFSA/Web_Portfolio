// Admin API client that mirrors the pattern of api/projects.ts.
// All functions that talk to protected endpoints use authHeaders() to
// attach the JWT from sessionStorage automatically.

import type {
  LoginCredentials,
  LoginResponse,
} from "../types/auth.types";

const API = import.meta.env.VITE_API_URL || "/api";
const TOKEN_KEY = "adminToken";

// --------------- helper functions to manage the JWT in sessionStorage -----------------
export const getToken = (): string | null =>
  sessionStorage.getItem(TOKEN_KEY);
 
export const setToken = (token: string): void =>
  sessionStorage.setItem(TOKEN_KEY, token);
 
export const clearToken = (): void =>
  sessionStorage.removeItem(TOKEN_KEY);

// --------------- Request Helpers -----------------
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`API Error ${response.status}: ${response.statusText}`)
  }
  return response.json() as Promise<T>;
}

// builds the headers for requests to protected endpoints
function authHeaders(): HeadersInit {
  const token = getToken();
  // returns an object with the Authorization header if a token is present, otherwise just returns Content-Type
  // ... unpacks the object returns by the ternaray operator "? :" and merges it with the Content-Type header
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// --------------- Auth endpoints -----------------

// logs in teh admin user and returns the JWT token if successful
export async function loginAdmin(credentials: LoginCredentials): Promise<string> {
  const response = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  const data = await handleResponse<LoginResponse>(response);
  return data.token;
}

// returns true if user has valid admin JWT token
export async function verifyAdmin(): Promise<boolean> {
  const token = getToken();
  
  if (!token) {
    return false;
  }

  try {
    const response = await fetch(`${API}/auth/verify`, {
      headers: authHeaders(),
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

export async function logoutAdmin(): Promise<void> {
  const token = getToken();
  if (!token) return;

  await fetch(`${API}/auth/logout`, {
    method: "POST",
    headers: authHeaders(),
  }).catch(() => {});
}