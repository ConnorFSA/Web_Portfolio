import {useState, useEffect} from 'react';
import {getProjectBriefBySlug} from '../api/projects';
import type * as ProjectTypes from '../types/project.types';

export function useProjectBrief(slug: string){
  const [project, setProject] = useState<ProjectTypes.ProjectBrief>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    getProjectBriefBySlug(slug)
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