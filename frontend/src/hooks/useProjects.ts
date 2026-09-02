/* eslint-disable react-hooks/set-state-in-effect */
import {useState, useEffect} from 'react';
import {getProjects} from '../api/projects';
import type * as ProjectTypes from '../types/project.types';

export function useProjects() {
  // The hook tracks both the data and the request lifecycle so the UI can render
  // loading and error states without coupling to a specific page component.
  const [projects, setProjects] = useState<ProjectTypes.ProjectBrief[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    // The network request runs once on mount and is cancelled if the component
    // unmounts before the promise resolves.
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