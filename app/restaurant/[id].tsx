import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { Restaurant } from '../../src/types/restaurant';
import { useRestaurants } from '../../src/hooks/useRestaurants';
import { RestaurantForm } from '../../src/components/RestaurantForm';
import { Ionicons } from '@expo/vector-icons';
import { DeleteConfirmationModal } from '../../src/components/DeleteConfirmationModal';

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams();
  const { restaurants, loading, error, updateRestaurant, deleteRestaurant } = useRestaurants();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  const handleDelete = async () => {
    try {
      if (!restaurant?.id && !restaurant?._id) return;
      const restaurantId = restaurant.id || restaurant._id;
      if (!restaurantId) return;
      await deleteRestaurant(restaurantId);
      router.back();
    } catch (error) {
      console.error('Error deleting restaurant:', error);
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
            <View style={styles.headerButtons}>
              <TouchableOpacity
                onPress={() => setIsEditing(!isEditing)}
                style={styles.headerButton}
              >
                <Ionicons name="pencil" size={24} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowDeleteModal(true)}
                style={styles.headerButton}
              >
                <Ionicons name="trash" size={24} color="#ff3b30" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      {isEditing ? (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
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

      <DeleteConfirmationModal
        visible={showDeleteModal}
        name={restaurant.name}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#000',
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
  headerButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  headerButton: {
    padding: 8,
  },
  rating: {
    fontSize: 24,
    fontWeight: 'bold',
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
}); 