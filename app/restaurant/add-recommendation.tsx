import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RecommendationForm } from '../../src/components/RecommendationForm';
import { router } from 'expo-router';

export default function AddRecommendationScreen() {
  const handleSubmit = async (recommendation: any) => {
    try {
      const response = await fetch('http://localhost:3000/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recommendation),
      });

      if (!response.ok) {
        throw new Error('Failed to add recommendation');
      }

      router.back();
    } catch (error) {
      console.error('Error adding recommendation:', error);
      // Handle error appropriately
    }
  };

  return (
    <View style={styles.container}>
      <RecommendationForm onSubmit={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
}); 