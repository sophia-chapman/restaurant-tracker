import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Restaurant } from '../types/restaurant';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface RestaurantListProps {
  onPress?: (restaurant: Restaurant) => void;
  restaurants: Restaurant[];
  loading?: boolean;
  error?: string | null;
}

export default function RestaurantList({ onPress, restaurants, loading, error }: RestaurantListProps) {
  const sortedRestaurants = useMemo(() => {
    return [...restaurants].sort((a, b) => {
      // Sort by favorite status first
      if (a.favorite && !b.favorite) return -1;
      if (!a.favorite && b.favorite) return 1;
      // If both have same favorite status, sort by name
      return a.name.localeCompare(b.name);
    });
  }, [restaurants]);

  const renderItem = ({ item }: { item: Restaurant }) => (
    <TouchableOpacity
      style={[
        styles.restaurantItem,
        item.rating === 'good' ? styles.restaurantItemGood :
        item.rating === 'okay' ? styles.restaurantItemOkay :
        styles.restaurantItemBad
      ]}
      onPress={() => onPress ? onPress(item) : router.push(`/restaurant/${item.id}`)}
    >
      {item.favorite && (
        <View style={styles.favoriteStar}>
          <Ionicons name="star" size={24} color="#FFD700" />
        </View>
      )}
      <Text style={styles.restaurantName}>{item.name}</Text>
      <Text style={styles.restaurantDetails}>
        {item.cuisineType}
      </Text>
      <View style={styles.tagsContainer}>
        {item.location.map((tag, index) => (
          <View key={index} style={[styles.tag, styles.locationTag]}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
        {item.vibeTags.map((tag, index) => (
          <View key={index} style={[styles.tag, styles.vibeTag]}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
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
      <FlatList
        data={sortedRestaurants}
        renderItem={renderItem}
        keyExtractor={(item) => item.id || item._id || ''}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  restaurantItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  restaurantItemGood: {
    borderColor: '#4CAF50',
  },
  restaurantItemOkay: {
    borderColor: '#FFC107',
  },
  restaurantItemBad: {
    borderColor: '#F44336',
  },
  favoriteStar: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    paddingRight: 32,
  },
  restaurantDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  locationTag: {
    backgroundColor: '#e0e0e0',
  },
  vibeTag: {
    backgroundColor: '#E3F2FD',
  },
  tagText: {
    color: '#666',
    fontSize: 14,
  },
}); 