import React, { useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity, FlatList } from 'react-native';
import RestaurantList from '../../src/components/RestaurantList';
import RecommendationList from '../../src/components/RecommendationList';
import { useRestaurants } from '../../src/hooks/useRestaurants';
import { useRecommendations } from '../../src/hooks/useRecommendations';
import { router, useFocusEffect } from 'expo-router';
import { Restaurant } from '../../src/types/restaurant';

type SortOption = 'all' | 'reviewed' | 'recommended';

interface CombinedItem {
  type: 'restaurant' | 'recommendation';
  data: Restaurant | any;
}

export default function HomeScreen() {
  const [sortOption, setSortOption] = useState<SortOption>('all');
  const { restaurants, loading: restaurantsLoading, error: restaurantsError, refresh: refreshRestaurants } = useRestaurants();
  const { recommendations, loading: recommendationsLoading, error: recommendationsError, refresh: refreshRecommendations } = useRecommendations();

  // Create a single memoized refresh function
  const refreshAll = useCallback(async () => {
    await Promise.all([
      refreshRestaurants(),
      refreshRecommendations()
    ]);
  }, [refreshRestaurants, refreshRecommendations]);

  // Refresh data when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      refreshAll();
    }, [refreshAll])
  );

  const handleRestaurantPress = (restaurant: Restaurant) => {
    router.push(`/restaurant/${restaurant.id}`);
  };

  const handleRecommendationPress = (recommendation: any) => {
    router.push(`/restaurant/recommendation/${recommendation.id}`);
  };

  const loading = restaurantsLoading || recommendationsLoading;
  const error = restaurantsError || recommendationsError;

  const combinedItems = useMemo(() => {
    if (sortOption === 'all') {
      // Split restaurants into favorites and non-favorites
      const favoriteRestaurants = restaurants
        .filter(restaurant => restaurant.favorite)
        .sort((a, b) => new Date(b.visitedDate).getTime() - new Date(a.visitedDate).getTime());
      
      const nonFavoriteRestaurants = restaurants
        .filter(restaurant => !restaurant.favorite)
        .sort((a, b) => new Date(b.visitedDate).getTime() - new Date(a.visitedDate).getTime());

      // Sort recommendations by date added (using createdAt from timestamps)
      const sortedRecommendations = [...recommendations].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      // Combine all items in the desired order
      const items: CombinedItem[] = [
        ...favoriteRestaurants.map(restaurant => ({ type: 'restaurant' as const, data: restaurant })),
        ...nonFavoriteRestaurants.map(restaurant => ({ type: 'restaurant' as const, data: restaurant })),
        ...sortedRecommendations.map(recommendation => ({ type: 'recommendation' as const, data: recommendation }))
      ];

      return items;
    }
    return [];
  }, [restaurants, recommendations, sortOption]);

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
      <View style={styles.sortButtons}>
        <TouchableOpacity
          style={[styles.sortButton, sortOption === 'all' && styles.activeSortButton]}
          onPress={() => setSortOption('all')}
        >
          <Text style={[styles.sortButtonText, sortOption === 'all' && styles.activeSortButtonText]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sortOption === 'reviewed' && styles.activeSortButton]}
          onPress={() => setSortOption('reviewed')}
        >
          <Text style={[styles.sortButtonText, sortOption === 'reviewed' && styles.activeSortButtonText]}>
            Reviewed
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sortOption === 'recommended' && styles.activeSortButton]}
          onPress={() => setSortOption('recommended')}
        >
          <Text style={[styles.sortButtonText, sortOption === 'recommended' && styles.activeSortButtonText]}>
            Recommended
          </Text>
        </TouchableOpacity>
      </View>

      {sortOption === 'all' && (
        <FlatList
          data={combinedItems}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.type}-${item.data._id || item.data.id}`}
          contentContainerStyle={styles.list}
        />
      )}

      {sortOption === 'reviewed' && (
        <RestaurantList
          onPress={handleRestaurantPress}
          restaurants={restaurants}
          loading={restaurantsLoading}
          error={restaurantsError}
        />
      )}

      {sortOption === 'recommended' && (
        <RecommendationList
          onPress={handleRecommendationPress}
          recommendations={recommendations}
          loading={recommendationsLoading}
          error={recommendationsError}
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
  sortButtons: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sortButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  activeSortButton: {
    backgroundColor: '#007AFF',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#666',
  },
  activeSortButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  list: {
    padding: 16,
  },
});
