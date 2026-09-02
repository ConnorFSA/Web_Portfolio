import type * as ProjectTypes from '../types/project.types';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

// A single response wrapper centralizes error handling and keeps the fetch helpers
// consistent across the frontend API layer.
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    // response.status gives http code
    // response.statusText gives the description
    throw new Error (`API Error ${response.status}: ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

// Brief project data is used in list views, where the UI does not need the full
// detail payload for each item.
export async function getProjects(): Promise<ProjectTypes.ProjectBrief[]> {
  const response = await fetch(`${BASE_URL}/projects`);
  return handleResponse<ProjectTypes.ProjectBrief[]>(response);
}

// This route returns the full project model, including structured content and
// media metadata needed by the detail page.
export async function getProjectBySlug(slug: string): Promise<ProjectTypes.Project> {
  const response = await fetch(`${BASE_URL}/projects/${slug}`);
  return handleResponse<ProjectTypes.Project>(response);
}

// Fetches and returns brief data for a project by slug
export async function getProjectBriefBySlug(slug: string): Promise<ProjectTypes.ProjectBrief> {
  const response = await fetch(`${BASE_URL}/projects/${slug}/brief`);
  return handleResponse<ProjectTypes.ProjectBrief>(response);
}