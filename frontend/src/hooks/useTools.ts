import { useState, useEffect } from 'react';
import type { Tool } from '../types/project.types';
import { getTools } from '../api/languages&tools';

// This hook is used to fetch the list of tools from the API and manage the loading and error states.
export function useTools() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    getTools()
      .then((data) => {
        if (!cancelled) {
          setTools(data)
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

      return() => {
        cancelled = true;
      }
  }, []);

  return {tools, loading, error};

}