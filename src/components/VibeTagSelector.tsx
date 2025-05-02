import React from 'react';
import { TagSelector } from './TagSelector';

interface VibeTagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export const VibeTagSelector: React.FC<VibeTagSelectorProps> = ({
  selectedTags,
  onTagsChange,
}) => {
  return (
    <TagSelector
      selectedTags={selectedTags}
      onTagsChange={onTagsChange}
      placeholder="Add vibe tag..."
      apiEndpoint="vibe-tags"
    />
  );
}; 