import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Restaurant } from '../types/restaurant';
import { router } from 'expo-router';

interface RestaurantListProps {
  onPress?: (restaurant: Restaurant) => void;
  restaurants: Restaurant[];
  loading?: boolean;
  error?: string | null;
}

export default function RestaurantList({ onPress, restaurants, loading, error }: RestaurantListProps) {
  const renderItem = ({ item }: { item: Restaurant }) => (
    <TouchableOpacity
      style={styles.restaurantItem}
      onPress={() => onPress ? onPress(item) : router.push(`/restaurant/${item.id}`)}
    >
      <Text style={styles.restaurantName}>{item.name}</Text>
      <Text style={styles.restaurantDetails}>
        {item.cuisineType} • {item.rating}
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
        data={restaurants}
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
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
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