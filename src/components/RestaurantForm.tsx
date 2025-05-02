import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Restaurant, Rating } from '../types/restaurant';
import { LocationTagSelector } from './LocationTagSelector';
import { VibeTagSelector } from './VibeTagSelector';

interface RestaurantFormProps {
  onSubmit: (restaurant: Omit<Restaurant, 'id'>) => void;
  initialData?: Omit<Restaurant, 'id'>;
}

export const RestaurantForm: React.FC<RestaurantFormProps> = ({ onSubmit, initialData }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [locationTags, setLocationTags] = useState<string[]>(initialData?.location || []);
  const [vibeTags, setVibeTags] = useState<string[]>(initialData?.vibeTags || []);
  const [cuisineType, setCuisineType] = useState(initialData?.cuisineType || '');
  const [rating, setRating] = useState<Rating>(initialData?.rating || 'okay');
  const [order, setOrder] = useState(initialData?.order || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const restaurantData: Omit<Restaurant, 'id'> = {
        name,
        location: locationTags,
        vibeTags,
        cuisineType,
        rating,
        order,
        description,
        visitedDate: new Date().toISOString(),
      };

      onSubmit(restaurantData);
    } catch (error) {
      console.error('Error submitting restaurant:', error);
      // Handle error appropriately
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Restaurant Name"
        value={name}
        onChangeText={setName}
      />
      <LocationTagSelector
        selectedTags={locationTags}
        onTagsChange={setLocationTags}
      />
      <VibeTagSelector
        selectedTags={vibeTags}
        onTagsChange={setVibeTags}
      />
      <TextInput
        style={styles.input}
        placeholder="Cuisine Type"
        value={cuisineType}
        onChangeText={setCuisineType}
      />
      <View style={styles.ratingContainer}>
        {(['good', 'okay', 'bad'] as Rating[]).map((r) => (
          <TouchableOpacity
            key={r}
            style={[styles.ratingButton, rating === r && styles.selectedRating]}
            onPress={() => setRating(r)}
          >
            <Text style={styles.ratingText}>{r}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.input}
        placeholder="What did you order?"
        value={order}
        onChangeText={setOrder}
      />
      <TextInput
        style={[styles.input, styles.descriptionInput]}
        placeholder="Description of your experience"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? 'Saving...' : 'Save Restaurant'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    fontSize: 16,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  ratingButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  selectedRating: {
    backgroundColor: '#007AFF',
  },
  ratingText: {
    fontSize: 16,
    color: '#000',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 