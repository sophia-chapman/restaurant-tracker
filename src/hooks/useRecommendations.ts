import { useState, useEffect, useCallback } from 'react';

interface Recommendation {
  id: string;
  name: string;
  location: string[];
  cuisineType: string;
  recommendedBy: string;
  notes: string;
  createdAt: string;
}

export function useRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/recommendations');
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }
      const data = await response.json();
      const transformedData = data.map((item: any) => ({
        ...item,
        id: item._id,
      }));
      setRecommendations(transformedData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const search = useCallback(async (filters: { name?: string; location?: string; cuisineType?: string }) => {
    try {
      setLoading(true);
      // If no filters are provided, fetch all recommendations
      if (!filters.name && !filters.location && !filters.cuisineType) {
        await fetchRecommendations();
        return;
      }

      const queryParams = new URLSearchParams();
      if (filters.name) queryParams.append('name', filters.name);
      if (filters.location) queryParams.append('location', filters.location);
      if (filters.cuisineType) queryParams.append('cuisineType', filters.cuisineType);

      const response = await fetch(`http://localhost:3000/api/recommendations/search?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to search recommendations');
      }
      const data = await response.json();
      const transformedData = data.map((item: any) => ({
        ...item,
        id: item._id,
      }));
      setRecommendations(transformedData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [fetchRecommendations]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return {
    recommendations,
    loading,
    error,
    refresh: fetchRecommendations,
    search,
  };
} 