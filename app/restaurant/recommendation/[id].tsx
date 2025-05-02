import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, router, useFocusEffect } from 'expo-router';
import { useRecommendations } from '../../../src/hooks/useRecommendations';
import { Ionicons } from '@expo/vector-icons';
import { DeleteConfirmationModal } from '../../../src/components/DeleteConfirmationModal';

export default function RecommendationDetailScreen() {
  const { id } = useLocalSearchParams();
  const { recommendations, loading, error, refresh, deleteRecommendation } = useRecommendations();
  const [recommendation, setRecommendation] = useState<any | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (recommendations) {
      const foundRecommendation = recommendations.find(r => r.id === id);
      setRecommendation(foundRecommendation || null);
    }
  }, [recommendations, id]);

  // Refresh data when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      refresh();
    }, [refresh])
  );

  const handleEdit = () => {
    router.push(`/restaurant/recommendation/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await deleteRecommendation(id as string);
      router.back();
    } catch (error) {
      console.error('Error deleting recommendation:', error);
    }
  };

  const handleReview = () => {
    if (!recommendation) return;
    
    // Navigate to add restaurant form with pre-filled data
    router.push({
      pathname: '/restaurant/add',
      params: {
        name: recommendation.name,
        location: recommendation.location.join(','),
        cuisineType: recommendation.cuisineType,
        recommendationId: recommendation.id,
      }
    });
  };

  // Only show loading indicator if we don't have any recommendations yet
  if (loading && recommendations.length === 0) {
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
          title: recommendation.name,
          headerBackTitle: 'Back',
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity onPress={handleEdit} style={styles.headerButton}>
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
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.label}>Cuisine Type</Text>
          <Text style={styles.value}>{recommendation.cuisineType}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Location</Text>
          <View style={styles.tagsContainer}>
            {recommendation.location.map((tag: string, index: number) => (
              <View key={index} style={[styles.tag, styles.locationTag]}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Recommended By</Text>
          <Text style={styles.value}>{recommendation.recommendedBy}</Text>
        </View>

        {recommendation.notes && (
          <View style={styles.section}>
            <Text style={styles.label}>Notes</Text>
            <Text style={styles.value}>{recommendation.notes}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.label}>Added On</Text>
          <Text style={styles.value}>
            {new Date(recommendation.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <TouchableOpacity style={styles.reviewButton} onPress={handleReview}>
          <Text style={styles.reviewButtonText}>Review this restaurant</Text>
        </TouchableOpacity>
      </ScrollView>

      <DeleteConfirmationModal
        visible={showDeleteModal}
        name={recommendation.name}
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
  reviewButton: {
    backgroundColor: '#007AFF',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  reviewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 