import {useState, useEffect} from 'react';
import {getProjectBySlug} from '../api/projects';
import type * as ProjectTypes from '../types/project.types';

export function useProjectDetail(slug: string){
  const [project, setProject] = useState<ProjectTypes.Project>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

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
  }, []);

  return { project, loading, error };
}