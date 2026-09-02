// Admin API client that mirrors the pattern of api/projects.ts.
// All functions that talk to protected endpoints use authHeaders() to
// attach the JWT from sessionStorage automatically.

import type {
  LoginCredentials,
  LoginResponse,
} from "../types/auth.types";
import type { ProjectImage } from "../types/project.types";
import type { Project } from "../types/project.types";

export type ProjectOption = { id: number; image_url?: string };
export type ProjectOptions = {
  categories: Array<ProjectOption & { category: string }>;
  languages: Array<ProjectOption & { language: string }>;
  tools: Array<ProjectOption & { tool: string }>;
  types: Array<ProjectOption & { type: string }>;
};

export type ProjectMetadataPayload = {
  name: string;
  slug: string;
  summary: string;
  start_date: string;
  end_date: string | null;
  thumbnail_image: string;
  url: string;
  category_ids: number[];
  language_ids: number[];
  tool_ids: number[];
  type_ids: number[];
};

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
  } catch {
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

export async function uploadProjectImage(
  projectId: number,
  file: File,
  altText: string,
): Promise<ProjectImage> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("alt_text", altText);

  const token = getToken();
  const response = await fetch(`${API}/admin/projects/${projectId}/images`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  return handleResponse<ProjectImage>(response);
}

export async function getProjectOptions(): Promise<ProjectOptions> {
  const response = await fetch(`${API}/admin/projects/options`, { headers: authHeaders() });
  return handleResponse<ProjectOptions>(response);
}

export async function createProject(payload: ProjectMetadataPayload): Promise<Project> {
  const response = await fetch(`${API}/admin/projects`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse<Project>(response);
}

export async function updateProjectMetadata(projectId: number, payload: Partial<ProjectMetadataPayload>): Promise<Project> {
  const response = await fetch(`${API}/admin/projects/${projectId}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse<Project>(response);
}

export async function updateProjectImageAltText(projectId: number, imageId: number, altText: string): Promise<ProjectImage> {
  const response = await fetch(`${API}/admin/projects/${projectId}/images/${imageId}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ alt_text: altText }),
  });
  return handleResponse<ProjectImage>(response);
}