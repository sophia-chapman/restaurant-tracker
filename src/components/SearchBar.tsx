import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { RestaurantFilters } from '../types/restaurant';

interface SearchBarProps {
  onSearch: (filters: RestaurantFilters) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [cuisineType, setCuisineType] = useState('');
  const [rating, setRating] = useState<RestaurantFilters['rating']>();

  const handleSearch = () => {
    onSearch({
      name: name || undefined,
      location: location || undefined,
      cuisineType: cuisineType || undefined,
      rating,
    });
  };

  const handleReset = () => {
    setName('');
    setLocation('');
    setCuisineType('');
    setRating(undefined);
    onSearch({});
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search by name"
        value={name}
        onChangeText={setName}
        onSubmitEditing={handleSearch}
        key="name-input"
      />
      <TextInput
        style={styles.input}
        placeholder="Search by location"
        value={location}
        onChangeText={setLocation}
        onSubmitEditing={handleSearch}
        key="location-input"
      />
      <TextInput
        style={styles.input}
        placeholder="Search by cuisine type"
        value={cuisineType}
        onChangeText={setCuisineType}
        onSubmitEditing={handleSearch}
        key="cuisine-input"
      />
      <View style={styles.ratingContainer} key="rating-container">
        {(['good', 'okay', 'bad'] as const).map((r) => (
          <TouchableOpacity
            key={`rating-${r}`}
            style={[
              styles.ratingButton,
              rating === r && styles.selectedRating,
              styles[`rating${r}`]
            ]}
            onPress={() => setRating(rating === r ? undefined : r)}
          >
            <Text style={[styles.ratingText, rating === r && styles.selectedRatingText]}>
              {r}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  ratingButton: {
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  ratinggood: {
    backgroundColor: '#E8F5E9',
  },
  ratingokay: {
    backgroundColor: '#FFF3E0',
  },
  ratingbad: {
    backgroundColor: '#FFEBEE',
  },
  selectedRating: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  ratingText: {
    fontSize: 16,
    color: '#666',
  },
  selectedRatingText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  searchButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#666',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 