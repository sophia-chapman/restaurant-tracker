import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { LocationTagSelector } from './LocationTagSelector';

interface Recommendation {
  name: string;
  location: string[];
  cuisineType: string;
  recommendedBy: string;
  notes: string;
}

interface RecommendationFormProps {
  onSubmit: (recommendation: Recommendation) => void;
  initialData?: Recommendation;
}

export const RecommendationForm: React.FC<RecommendationFormProps> = ({ onSubmit, initialData }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [locationTags, setLocationTags] = useState<string[]>(initialData?.location || []);
  const [cuisineType, setCuisineType] = useState(initialData?.cuisineType || '');
  const [recommendedBy, setRecommendedBy] = useState(initialData?.recommendedBy || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const recommendationData: Recommendation = {
        name,
        location: locationTags,
        cuisineType,
        recommendedBy,
        notes,
      };

      onSubmit(recommendationData);
    } catch (error) {
      console.error('Error submitting recommendation:', error);
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
      <TextInput
        style={styles.input}
        placeholder="Cuisine Type"
        value={cuisineType}
        onChangeText={setCuisineType}
      />
      <TextInput
        style={styles.input}
        placeholder="Recommended By"
        value={recommendedBy}
        onChangeText={setRecommendedBy}
      />
      <TextInput
        style={[styles.input, styles.notesInput]}
        placeholder="Additional Notes"
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={4}
      />
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? 'Saving...' : 'Save Recommendation'}
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
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
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