import React from 'react';
import { View, StyleSheet } from 'react-native';
import RestaurantList from '../../src/components/RestaurantList';
import { SearchBar } from '../../src/components/SearchBar';
import { useRestaurants } from '../../src/hooks/useRestaurants';
import { router } from 'expo-router';
import { Restaurant, RestaurantFilters } from '../../src/types/restaurant';

export default function TabTwoScreen() {
  const { restaurants, loading, error, search } = useRestaurants();

  const handleSearch = (filters: RestaurantFilters) => {
    search(filters);
  };

  const handleRestaurantPress = (restaurant: Restaurant) => {
    if (restaurant.id) {
      router.push({
        pathname: '/restaurant/[id]',
        params: { id: restaurant.id }
      });
    }
  };

  return (
    <View style={styles.container}>
      <SearchBar onSearch={handleSearch} key="search-bar" />
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
});
