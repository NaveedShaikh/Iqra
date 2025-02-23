import { useState, useEffect, useCallback } from "react";

export const useFetch = (url:string, options = {}) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Create a stable stringified options object for useEffect comparison
  const optionsString = JSON.stringify(options);

  // Fetch function to get fresh data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(url, { cache: "no-store", ...options });
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const result = await response.json();
      setData(result.data);
      setError(null); // Clear errors on success
    } catch (err:any) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [url, optionsString]);

  // Fetch on mount and when URL or options change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, error, loading, refetch: fetchData };
};
