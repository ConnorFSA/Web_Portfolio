import * as ProjectTypes from '../types/project.types'

const BASE_URL = import.meta.env.VITE_API_URL || 'api';

// Generic Error handling functions for API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    // response.status gives http code
    // response.statusText gives the description
    throw new Error (`API Error ${response.status}: ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

// fetches and returns a list of languages stored in the database
export async function getLanguages(): Promise<ProjectTypes.Language[]> {
  const response = await fetch(`${BASE_URL}/languages`);
  return handleResponse<ProjectTypes.Language[]>(response)
}

// fetches and returns a list of tools stored in the database
export async function getTools(): Promise<ProjectTypes.Tool[]> {
  const response = await fetch(`${BASE_URL}/tools`);
  return handleResponse<ProjectTypes.Tool[]>(response)
}