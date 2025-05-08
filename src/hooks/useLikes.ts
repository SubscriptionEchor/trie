import { useState } from 'react';

interface UseLikesResult {
  likedItems: Record<string, boolean>;
  likeCounts: Record<string, number>;
  handleLike: (itemId: string, currentLikes: string) => void;
}

export function useLikes(): UseLikesResult {
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});

  const handleLike = (itemId: string, currentLikes: string): void => {
    // Initialize like count if not already set
    if (!likeCounts[itemId]) {
      setLikeCounts(prev => ({
        ...prev,
        [itemId]: parseInt(currentLikes.replace(/[^0-9]/g, ''), 10) || 0
      }));
    }

    setLikedItems(prev => {
      const wasLiked = prev[itemId];
      const newLikedItems = { ...prev, [itemId]: !wasLiked };
      
      // Update counts after state update
      setLikeCounts(prevCounts => ({
        ...prevCounts,
        [itemId]: (prevCounts[itemId] || 0) + (!wasLiked ? 1 : -1)
      }));
      
      return newLikedItems;
    });
  };

  return { likedItems, likeCounts, handleLike };
}