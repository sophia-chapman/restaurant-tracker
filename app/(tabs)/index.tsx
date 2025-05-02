import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import RestaurantList from '../../src/components/RestaurantList';
import { useRestaurants } from '../../src/hooks/useRestaurants';
import { router } from 'expo-router';
import { Restaurant } from '../../src/types/restaurant';

export default function HomeScreen() {
  const { restaurants, loading, error } = useRestaurants();

  const handleRestaurantPress = (restaurant: Restaurant) => {
    router.push(`/restaurant/${restaurant.id}`);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <RestaurantList
        onPress={handleRestaurantPress}
        restaurants={restaurants}
        loading={loading}
        error={error}
        key="restaurant-list"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
});
