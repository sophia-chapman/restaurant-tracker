import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RestaurantForm } from '../../src/components/RestaurantForm';
import { useRestaurants } from '../../src/hooks/useRestaurants';
import { router, useLocalSearchParams } from 'expo-router';
import { Restaurant } from '../../src/types/restaurant';

export default function AddRestaurantScreen() {
  const { addRestaurant, refresh } = useRestaurants();
  const params = useLocalSearchParams();

  // Convert params to initial data if they exist
  const initialData = params.name ? {
    name: params.name as string,
    location: (params.location as string)?.split(',').filter(Boolean) || [],
    cuisineType: params.cuisineType as string,
    vibeTags: [],
    rating: 'okay' as const,
    order: '',
    description: '',
    visitedDate: new Date().toISOString(),
    favorite: false,
  } : undefined;

  const handleSubmit = async (restaurant: Omit<Restaurant, 'id'>) => {
    try {
      const newRestaurant = await addRestaurant(restaurant);

      // If this was converted from a recommendation, soft delete it
      if (params.recommendationId) {
        try {
          const response = await fetch(`http://localhost:3000/api/recommendations/${params.recommendationId}`, {
            method: 'DELETE',
          });
          if (!response.ok) {
            throw new Error('Failed to delete recommendation');
          }
        } catch (error) {
          console.error('Error deleting recommendation:', error);
          // Continue with navigation even if recommendation deletion fails
        }
      }

      // Navigate to the new restaurant's details page
      if (newRestaurant.id) {
        router.push(`/restaurant/${newRestaurant.id}`);
      } else {
        // Fallback to home if for some reason we don't have an ID
        router.push('/');
      }
      
      // Then refresh the data after a short delay to ensure navigation is complete
      setTimeout(() => {
        refresh();
      }, 100);
    } catch (error) {
      console.error('Error adding restaurant:', error);
      // Handle error appropriately
    }
  };

  return (
    <View style={styles.container}>
      <RestaurantForm onSubmit={handleSubmit} initialData={initialData} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
}); 