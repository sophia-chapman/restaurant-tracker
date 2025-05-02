import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { Restaurant } from '../../src/types/restaurant';
import { useRestaurants } from '../../src/hooks/useRestaurants';
import { RestaurantForm } from '../../src/components/RestaurantForm';
import { Ionicons } from '@expo/vector-icons';

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams();
  const { restaurants, loading, error, updateRestaurant } = useRestaurants();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (restaurants) {
      const foundRestaurant = restaurants.find(r => r.id === id || r._id === id);
      setRestaurant(foundRestaurant || null);
    }
  }, [restaurants, id]);

  const handleUpdate = async (updatedData: Omit<Restaurant, 'id'>) => {
    try {
      if (!restaurant?.id && !restaurant?._id) return;
      const restaurantId = restaurant.id || restaurant._id;
      if (!restaurantId) return;
      const updatedRestaurant = await updateRestaurant(restaurantId, updatedData);
      setRestaurant(updatedRestaurant);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating restaurant:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error || !restaurant) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error || 'Restaurant not found'}</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: restaurant.name,
          headerBackTitle: 'Back',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => setIsEditing(!isEditing)}
              style={styles.editButton}
            >
              <Ionicons name="pencil" size={24} color="#007AFF" />
            </TouchableOpacity>
          ),
        }}
      />
      {isEditing ? (
        <ScrollView style={styles.container}>
          <RestaurantForm
            onSubmit={handleUpdate}
            initialData={restaurant}
          />
        </ScrollView>
      ) : (
        <ScrollView style={styles.container}>
          <View style={styles.section}>
            <Text style={styles.label}>Rating</Text>
            <Text style={[styles.rating, styles[`rating${restaurant.rating}`]]}>
              {restaurant.rating}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Cuisine Type</Text>
            <Text style={styles.value}>{restaurant.cuisineType}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Location</Text>
            <View style={styles.tagsContainer}>
              {restaurant.location.map((tag, index) => (
                <View key={index} style={[styles.tag, styles.locationTag]}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Vibe</Text>
            <View style={styles.tagsContainer}>
              {restaurant.vibeTags.map((tag, index) => (
                <View key={index} style={[styles.tag, styles.vibeTag]}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Favorite</Text>
            <Text style={styles.value}>{restaurant.favorite ? 'Yes' : 'No'}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Order</Text>
            <Text style={styles.value}>{restaurant.order}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.value}>{restaurant.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Visited Date</Text>
            <Text style={styles.value}>
              {new Date(restaurant.visitedDate).toLocaleDateString()}
            </Text>
          </View>
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
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
  section: {
    marginBottom: 24,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  rating: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  ratinggood: {
    color: '#4CAF50',
  },
  ratingokay: {
    color: '#FFC107',
  },
  ratingbad: {
    color: '#F44336',
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
  editButton: {
    marginRight: 16,
  },
}); 