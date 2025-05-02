import React, { useMemo } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import RestaurantList from '../../src/components/RestaurantList';
import RecommendationList from '../../src/components/RecommendationList';
import { SearchBar } from '../../src/components/SearchBar';
import { useRestaurants } from '../../src/hooks/useRestaurants';
import { useRecommendations } from '../../src/hooks/useRecommendations';
import { router } from 'expo-router';
import { Restaurant, RestaurantFilters } from '../../src/types/restaurant';

type CombinedItem = {
  type: 'restaurant' | 'recommendation';
  data: Restaurant | any;
};

export default function TabTwoScreen() {
  const { restaurants, loading: restaurantsLoading, error: restaurantsError, search: searchRestaurants, refresh: refreshRestaurants } = useRestaurants();
  const { recommendations, loading: recommendationsLoading, error: recommendationsError, search: searchRecommendations, refresh: refreshRecommendations } = useRecommendations();

  const handleSearch = (filters: RestaurantFilters) => {
    searchRestaurants(filters);
    if (!filters.rating) {
      if (!filters.name && !filters.location && !filters.cuisineType) {
        refreshRecommendations();
      } else {
        searchRecommendations({
          name: filters.name,
          location: filters.location,
          cuisineType: filters.cuisineType,
        });
      }
    } else {
      searchRecommendations({});
    }
  };

  const handleRestaurantPress = (restaurant: Restaurant) => {
    if (restaurant.id) {
      router.push({
        pathname: '/restaurant/[id]',
        params: { id: restaurant.id }
      });
    }
  };

  const handleRecommendationPress = (recommendation: any) => {
    router.push(`/restaurant/recommendation/${recommendation.id}`);
  };

  const combinedItems = useMemo(() => {
    const items: CombinedItem[] = [
      ...restaurants.map(restaurant => ({ type: 'restaurant' as const, data: restaurant })),
      ...recommendations.map(recommendation => ({ type: 'recommendation' as const, data: recommendation }))
    ];
    return items;
  }, [restaurants, recommendations]);

  const renderItem = ({ item }: { item: CombinedItem }) => {
    if (item.type === 'restaurant') {
      return (
        <View>
          <RestaurantList
            onPress={handleRestaurantPress}
            restaurants={[item.data]}
            loading={false}
            error={null}
          />
        </View>
      );
    } else {
      return (
        <View>
          <RecommendationList
            onPress={handleRecommendationPress}
            recommendations={[item.data]}
            loading={false}
            error={null}
          />
        </View>
      );
    }
  };

  const loading = restaurantsLoading || recommendationsLoading;
  const error = restaurantsError || recommendationsError;

  return (
    <View style={styles.container}>
      <SearchBar onSearch={handleSearch} key="search-bar" />
      {loading ? (
        <View style={styles.center}>
          <Text>Loading...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.error}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={combinedItems}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.type}-${item.data._id || item.data.id}`}
          contentContainerStyle={styles.list}
        />
      )}
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
  list: {
    padding: 16,
  },
});
