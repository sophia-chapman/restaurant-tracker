import { Restaurant, RestaurantFilters } from '../types/restaurant';
import env from '../config/env';

const API_URL = env.apiUrl;

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  
  // Transform MongoDB _id to id if it's an array of restaurants
  if (Array.isArray(data)) {
    return data.map(restaurant => ({
      ...restaurant,
      id: restaurant._id,
      _id: undefined
    }));
  }
  
  // Transform single restaurant
  if (data._id) {
    return {
      ...data,
      id: data._id,
      _id: undefined
    };
  }
  
  return data;
};

export const getRestaurants = async (): Promise<Restaurant[]> => {
  try {
    const response = await fetch(`${API_URL}/api/restaurants`);
    return handleResponse(response);
  } catch (error) {
    console.error('Error in getRestaurants:', error);
    throw error;
  }
};

export const searchRestaurants = async (filters: RestaurantFilters): Promise<Restaurant[]> => {
  try {
    const queryParams = new URLSearchParams();
    if (filters.name) queryParams.append('name', filters.name);
    if (filters.location) queryParams.append('location', filters.location);
    if (filters.cuisineType) queryParams.append('cuisineType', filters.cuisineType);
    if (filters.rating) queryParams.append('rating', filters.rating);

    const response = await fetch(`${API_URL}/api/restaurants/search?${queryParams}`);
    return handleResponse(response);
  } catch (error) {
    console.error('Error in searchRestaurants:', error);
    throw error;
  }
};

export const addRestaurant = async (restaurant: Omit<Restaurant, 'id'>): Promise<Restaurant> => {
  try {
    const response = await fetch(`${API_URL}/api/restaurants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(restaurant),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error in addRestaurant:', error);
    throw error;
  }
};

export const updateRestaurant = async (id: string, restaurant: Partial<Restaurant>): Promise<Restaurant> => {
  try {
    const response = await fetch(`${API_URL}/api/restaurants/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(restaurant),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error in updateRestaurant:', error);
    throw error;
  }
};

export const deleteRestaurant = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/api/restaurants/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error in deleteRestaurant:', error);
    throw error;
  }
}; 