import { useState, useEffect } from 'react';
import type { Language } from '../types/project.types';
import { getLanguages } from '../api/languages&tools';

// This hook is used to fetch the list of languages from the API and manage the loading and error states.
export function useLanguages() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    getLanguages()
      .then((data) => {
        if (!cancelled) {
          setLanguages(data)
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

  return {languages, loading, error};

}