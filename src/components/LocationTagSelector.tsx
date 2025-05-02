import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, ScrollView, ActivityIndicator } from 'react-native';

interface LocationTagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export const LocationTagSelector: React.FC<LocationTagSelectorProps> = ({
  selectedTags,
  onTagsChange,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:3000/api/location-tags');
      if (!response.ok) {
        throw new Error('Failed to load tags');
      }
      const data = await response.json();
      setAvailableTags(data.map((tag: any) => tag.name));
    } catch (error) {
      console.error('Error loading tags:', error);
      setError('Failed to load tags. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleInputSubmit = async () => {
    const newTag = inputValue.trim();
    if (newTag && !selectedTags.includes(newTag)) {
      try {
        setError(null);
        const response = await fetch('http://localhost:3000/api/location-tags', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tags: [newTag] }),
        });
        if (!response.ok) {
          throw new Error('Failed to add tag');
        }
        onTagsChange([...selectedTags, newTag]);
        setInputValue('');
        loadTags(); // Refresh available tags
      } catch (error) {
        console.error('Error adding tag:', error);
        setError('Failed to add tag. Please try again.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.selectedTagsContainer}>
        {selectedTags.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={styles.selectedTag}
            onPress={() => handleRemoveTag(tag)}
          >
            <Text style={styles.selectedTagText}>{tag}</Text>
            <Text style={styles.removeTagText}>×</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add location tag..."
          value={inputValue}
          onChangeText={setInputValue}
          onSubmitEditing={handleInputSubmit}
        />
      </View>
      {loading ? (
        <ActivityIndicator size="small" color="#007AFF" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : availableTags.length > 0 ? (
        <View style={styles.availableTagsContainer}>
          <Text style={styles.sectionTitle}>Available Tags:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {availableTags
              .filter(tag => !selectedTags.includes(tag))
              .map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={styles.availableTag}
                  onPress={() => handleAddTag(tag)}
                >
                  <Text style={styles.availableTagText}>{tag}</Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  selectedTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  selectedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedTagText: {
    color: '#fff',
    fontSize: 14,
    marginRight: 4,
  },
  removeTagText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  availableTagsContainer: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  availableTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
  },
  availableTagText: {
    color: '#666',
    fontSize: 14,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 8,
  },
}); 