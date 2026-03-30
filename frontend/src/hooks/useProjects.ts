import {useState, useEffect} from 'react';
import {getProjects} from '../api/projects';
import type * as ProjectTypes from '../types/project.types';

export function useProjects() {
  const [projects, setProjects] = useState<ProjectTypes.ProjectBrief[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    getProjects()
      .then((data) => {
        if (!cancelled) {
          setProjects(data);
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
  }, []);

  return { projects, loading, error };
}