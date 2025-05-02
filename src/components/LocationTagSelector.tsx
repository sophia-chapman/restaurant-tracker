import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

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
    setIsDropdownVisible(false);
    setInputValue('');
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

  const filteredTags = availableTags.filter(tag => 
    !selectedTags.includes(tag) && 
    tag.toLowerCase().includes(inputValue.toLowerCase())
  );

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
          onChangeText={(text) => {
            setInputValue(text);
            setIsDropdownVisible(true);
          }}
          onFocus={() => setIsDropdownVisible(true)}
          onSubmitEditing={handleInputSubmit}
        />
        <TouchableOpacity 
          style={styles.dropdownButton}
          onPress={() => setIsDropdownVisible(!isDropdownVisible)}
        >
          <Ionicons 
            name={isDropdownVisible ? "chevron-up" : "chevron-down"} 
            size={24} 
            color="#666" 
          />
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="small" color="#007AFF" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : isDropdownVisible && filteredTags.length > 0 ? (
        <View style={styles.dropdownContainer}>
          <FlatList
            data={filteredTags}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleAddTag(item)}
              >
                <Text style={styles.dropdownItemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    paddingRight: 40,
    borderRadius: 8,
    fontSize: 16,
  },
  dropdownButton: {
    position: 'absolute',
    right: 12,
    padding: 4,
  },
  dropdownContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 8,
  },
}); 