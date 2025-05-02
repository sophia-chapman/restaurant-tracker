import React from 'react';
import { TagSelector } from './TagSelector';

interface LocationTagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export const LocationTagSelector: React.FC<LocationTagSelectorProps> = ({
  selectedTags,
  onTagsChange,
}) => {
  return (
    <TagSelector
      selectedTags={selectedTags}
      onTagsChange={onTagsChange}
      placeholder="Add location tag..."
      apiEndpoint="location-tags"
    />
  );
}; 