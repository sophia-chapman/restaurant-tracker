import { useState, useEffect } from 'react';

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

  const fetchRecommendations = async () => {
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
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return {
    recommendations,
    loading,
    error,
    refresh: fetchRecommendations,
  };
} 