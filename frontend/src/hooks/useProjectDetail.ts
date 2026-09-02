/* eslint-disable react-hooks/set-state-in-effect */
import {useState, useEffect} from 'react';
import {getProjectBySlug} from '../api/projects';
import type * as ProjectTypes from '../types/project.types';

export function useProjectDetail(slug: string){
  // This hook encapsulates the async fetch lifecycle for a single project detail view
  const [project, setProject] = useState<ProjectTypes.Project>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!slug) return () => { cancelled = true; };

    setLoading(true);
    setError(null);

    getProjectBySlug(slug)
      .then((data) => {
        if (!cancelled) {
          setProject(data);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err)
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      })

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { project, loading, error };
}