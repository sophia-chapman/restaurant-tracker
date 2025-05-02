import { useState, useEffect, useCallback } from 'react';
import { Restaurant, RestaurantFilters } from '../types/restaurant';
import { addRestaurant as addRestaurantAPI, getRestaurants, searchRestaurants } from '../services/api';

const API_URL = 'http://localhost:3000/api';

export const useRestaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurants = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getRestaurants();
      setRestaurants(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch restaurants');
      console.error('Error fetching restaurants:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addRestaurant = useCallback(async (restaurant: Omit<Restaurant, 'id'>) => {
    try {
      const newRestaurant = await addRestaurantAPI(restaurant);
      setRestaurants(prev => [...prev, newRestaurant]);
      return newRestaurant;
    } catch (err) {
      setError('Failed to add restaurant');
      console.error('Error adding restaurant:', err);
      throw err;
    }
  }, []);

  const search = useCallback(async (filters: RestaurantFilters) => {
    try {
      setLoading(true);
      const query = {
        name: filters.name,
        location: filters.location,
        cuisineType: filters.cuisineType,
        rating: filters.rating,
      };
      
      const data = await searchRestaurants(query);
      
      // Apply additional client-side filtering if needed
      let filteredResults = data;
      
      if (filters.rating) {
        filteredResults = data.filter((restaurant: Restaurant) => 
          restaurant.rating === filters.rating
        );
      }
      
      setRestaurants(filteredResults);
      setError(null);
    } catch (err) {
      setError('Failed to search restaurants');
      console.error('Error searching restaurants:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRestaurant = useCallback(async (id: string, restaurant: Partial<Restaurant>) => {
    try {
      const response = await fetch(`${API_URL}/restaurants/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(restaurant),
      });
      if (!response.ok) {
        throw new Error('Failed to update restaurant');
      }
      const updatedRestaurant = await response.json();
      setRestaurants((prev) =>
        prev.map((r) => (r.id === id ? updatedRestaurant : r))
      );
      return updatedRestaurant;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  }, []);

  const deleteRestaurant = useCallback(async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/restaurants/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete restaurant');
      }
      setRestaurants((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  return {
    restaurants,
    loading,
    error,
    addRestaurant,
    search,
    refresh: fetchRestaurants,
    updateRestaurant,
    deleteRestaurant,
  };
}; 