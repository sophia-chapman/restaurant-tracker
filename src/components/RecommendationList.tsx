import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

interface Recommendation {
  id: string;
  name: string;
  location: string[];
  cuisineType: string;
  recommendedBy: string;
  notes: string;
  createdAt: string;
}

interface RecommendationListProps {
  onPress?: (recommendation: Recommendation) => void;
  recommendations: Recommendation[];
  loading?: boolean;
  error?: string | null;
}

export default function RecommendationList({ onPress, recommendations, loading, error }: RecommendationListProps) {
  const sortedRecommendations = useMemo(() => {
    return [...recommendations].sort((a, b) => a.name.localeCompare(b.name));
  }, [recommendations]);

  const renderItem = ({ item }: { item: Recommendation }) => (
    <TouchableOpacity
      style={styles.recommendationItem}
      onPress={() => onPress ? onPress(item) : router.push(`/restaurant/recommendation/${item.id}`)}
    >
      <Text style={styles.recommendationName}>{item.name}</Text>
      <Text style={styles.recommendationDetails}>
        {item.cuisineType} 
      </Text>
      <View style={styles.tagsContainer}>
        {item.location.map((tag, index) => (
          <View key={index} style={[styles.tag, styles.locationTag]}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
      {item.notes && (
        <Text style={styles.notes} numberOfLines={2}>
          {item.notes}
        </Text>
      )}
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
        data={sortedRecommendations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
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
  recommendationItem: {
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
  recommendationName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  recommendationDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
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
  notes: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
}); 