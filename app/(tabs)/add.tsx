import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RestaurantForm } from '../../src/components/RestaurantForm';
import { useRestaurants } from '../../src/hooks/useRestaurants';
import { router } from 'expo-router';
import { Restaurant } from '../../src/types/restaurant';

export default function AddRestaurantScreen() {
  const { addRestaurant, refresh } = useRestaurants();

  const handleSubmit = async (restaurant: Omit<Restaurant, 'id'>) => {
    try {
      await addRestaurant(restaurant);
      await refresh(); // Refresh the list before navigating back
      router.back();
    } catch (error) {
      console.error('Error adding restaurant:', error);
      // Handle error appropriately
    }
  };

  return (
    <View style={styles.container}>
      <RestaurantForm onSubmit={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
}); 