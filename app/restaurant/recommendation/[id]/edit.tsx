import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { RecommendationForm } from '../../../../src/components/RecommendationForm';
import { useRecommendations } from '../../../../src/hooks/useRecommendations';
import env from '../../../../src/config/env';

export default function EditRecommendationScreen() {
  const { id } = useLocalSearchParams();
  const { recommendations, loading, error, refresh } = useRecommendations();
  const [recommendation, setRecommendation] = useState<any | null>(null);

  useEffect(() => {
    if (recommendations) {
      const foundRecommendation = recommendations.find(r => r.id === id);
      setRecommendation(foundRecommendation || null);
    }
  }, [recommendations, id]);

  const handleSubmit = async (updatedData: any) => {
    try {
      const response = await fetch(`${env.apiUrl}/api/recommendations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Failed to update recommendation');
      }

      await refresh();
      router.back();
    } catch (error) {
      console.error('Error updating recommendation:', error);
      // Handle error appropriately
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error || !recommendation) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error || 'Recommendation not found'}</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Edit Recommendation',
          headerBackTitle: 'Cancel',
        }}
      />
      <View style={styles.container}>
        <RecommendationForm
          onSubmit={handleSubmit}
          initialData={recommendation}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
}); 