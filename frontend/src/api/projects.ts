import type * as ProjectTypes from '../types/project.types';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Generic Error handling functions for API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    // response.status gives http code
    // response.statusText gives the description
    throw new Error (`API Error ${response.status}: ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

// Fetches and returns a list with the brief infomration on a project
export async function getProjects(): Promise<ProjectTypes.ProjectBrief[]> {
  const response = await fetch(`${BASE_URL}/projects`);
  return handleResponse<ProjectTypes.ProjectBrief[]>(response);
}

// Fetches and returns all data  associated with a project by its slug
export async function getProjectBySlug(slug: string): Promise<ProjectTypes.Project> {
  const response = await fetch(`${BASE_URL}/projects/${slug}`);
  return handleResponse<ProjectTypes.Project>(response);
}

// Fetches and returns brief data for a project by slug
export async function getProjectBriefBySlug(slug: string): Promise<ProjectTypes.ProjectBrief> {
  const response = await fetch(`${BASE_URL}/projects/${slug}/brief`);
  return handleResponse<ProjectTypes.ProjectBrief>(response);
}