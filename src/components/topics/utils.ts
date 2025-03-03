import { CourseSection } from "./types";

// Store for exam progress
export const examProgressStore: Record<
  string,
  { currentQuestionIndex: number; selectedAnswers: number[]; timeLeft: number }
> = {};

// Format time as MM:SS
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

// New code for course progress
export interface CourseProgress {
  completedItems: Record<string, boolean>; // Maps item IDs to completion status
}

// Generate a unique ID for a course item
export const generateItemId = (sectionIndex: number, itemIndex: number): string => {
  return `section-${sectionIndex}-item-${itemIndex}`;
};

// Load course progress from localStorage
export const loadCourseProgress = (): CourseProgress => {
  try {
    const savedProgress = localStorage.getItem('courseProgress');
    if (savedProgress) {
      return JSON.parse(savedProgress);
    }
  } catch (error) {
    console.error('Error loading course progress:', error);
  }
  
  // If no saved progress, create a new progress object with the first 3 items unlocked
  const initialProgress: CourseProgress = { completedItems: {} };
  
  // Mark the first 3 items as unlocked (not completed)
  // First item is always unlocked by default
  initialProgress.completedItems[generateItemId(0, 0)] = false;
  
  // Unlock the second item
  initialProgress.completedItems[generateItemId(0, 1)] = false;
  
  // Unlock the third item
  initialProgress.completedItems[generateItemId(0, 2)] = false;
  
  return initialProgress;
};

// Save course progress to localStorage
export const saveCourseProgress = (progress: CourseProgress): void => {
  try {
    // Ensure the first 3 items in the first section are always unlocked
    const updatedProgress = { ...progress };
    
    // Make sure the first 3 items are at least unlocked (if not already completed)
    for (let i = 0; i < 3; i++) {
      const itemId = generateItemId(0, i);
      if (!(itemId in updatedProgress.completedItems)) {
        updatedProgress.completedItems[itemId] = false;
      }
    }
    
    localStorage.setItem('courseProgress', JSON.stringify(updatedProgress));
  } catch (error) {
    console.error('Error saving course progress:', error);
  }
};

// Mark an item as completed and unlock the next item
export const completeItem = (
  courseSections: CourseSection[],
  sectionIndex: number,
  itemIndex: number,
  progress: CourseProgress
): CourseProgress => {
  const itemId = generateItemId(sectionIndex, itemIndex);
  const updatedProgress = {
    ...progress,
    completedItems: {
      ...progress.completedItems,
      [itemId]: true
    }
  };

  // Find the next item to unlock
  const currentSection = courseSections[sectionIndex];
  
  // If there's a next item in the current section
  if (itemIndex < currentSection.items.length - 1) {
    const nextItemId = generateItemId(sectionIndex, itemIndex + 1);
    updatedProgress.completedItems[nextItemId] = false; // Mark as unlocked but not completed
    
    // Check if this unlocks all items in the section
    const tempProgress = { ...updatedProgress };
    if (areAllSectionItemsUnlocked(courseSections, sectionIndex, tempProgress)) {
      // If all items in this section are unlocked, also unlock the first item in the next section
      return unlockNextSectionFirstItem(courseSections, sectionIndex, updatedProgress);
    }
  } 
  // If this is the last item in the section and there's a next section
  else if (sectionIndex < courseSections.length - 1) {
    const nextSectionId = generateItemId(sectionIndex + 1, 0);
    updatedProgress.completedItems[nextSectionId] = false; // Mark as unlocked but not completed
  }

  // Save the updated progress
  saveCourseProgress(updatedProgress);
  
  return updatedProgress;
};

// Check if an item is locked based on course progress
export const isItemLocked = (
  courseSections: CourseSection[],
  sectionIndex: number,
  itemIndex: number,
  progress: CourseProgress
): boolean => {
  // First three items in the first section are always unlocked
  if (sectionIndex === 0 && itemIndex < 3) {
    return false;
  }

  const itemId = generateItemId(sectionIndex, itemIndex);
  
  // If the item is explicitly marked as unlocked or completed in progress
  if (itemId in progress.completedItems) {
    return false;
  }

  // Check if the previous item is completed
  let prevItemId;
  
  // If it's the first item in a section (except the first section)
  if (itemIndex === 0 && sectionIndex > 0) {
    const prevSection = courseSections[sectionIndex - 1];
    prevItemId = generateItemId(sectionIndex - 1, prevSection.items.length - 1);
  } else if (itemIndex > 0) {
    // If it's not the first item in a section
    prevItemId = generateItemId(sectionIndex, itemIndex - 1);
  }

  // If there's a previous item, check if it's completed
  if (prevItemId) {
    return !progress.completedItems[prevItemId];
  }

  return true; // Default to locked if we can't determine
};

// Check if all items in a section are unlocked
export const areAllSectionItemsUnlocked = (
  courseSections: CourseSection[],
  sectionIndex: number,
  progress: CourseProgress
): boolean => {
  const section = courseSections[sectionIndex];
  if (!section) return false;
  
  // Check if all items in the section are unlocked
  for (let itemIndex = 0; itemIndex < section.items.length; itemIndex++) {
    if (isItemLocked(courseSections, sectionIndex, itemIndex, progress)) {
      return false;
    }
  }
  
  return true;
};

// Unlock the first item in the next section
export const unlockNextSectionFirstItem = (
  courseSections: CourseSection[],
  sectionIndex: number,
  progress: CourseProgress
): CourseProgress => {
  // Check if there is a next section
  if (sectionIndex < courseSections.length - 1) {
    const nextSectionFirstItemId = generateItemId(sectionIndex + 1, 0);
    
    // Only unlock if it's not already unlocked
    if (!(nextSectionFirstItemId in progress.completedItems)) {
      const updatedProgress = {
        ...progress,
        completedItems: {
          ...progress.completedItems,
          [nextSectionFirstItemId]: false // Mark as unlocked but not completed
        }
      };
      
      // Save the updated progress
      saveCourseProgress(updatedProgress);
      
      return updatedProgress;
    }
  }
  
  return progress;
};

// Check all sections and unlock the first item of the next section if needed
export const unlockNextSectionsIfNeeded = (
  courseSections: CourseSection[],
  progress: CourseProgress
): CourseProgress => {
  let updatedProgress = { ...progress };
  
  // Loop through all sections except the last one
  for (let sectionIndex = 0; sectionIndex < courseSections.length - 1; sectionIndex++) {
    // Check if all items in the current section are unlocked
    if (areAllSectionItemsUnlocked(courseSections, sectionIndex, updatedProgress)) {
      // Unlock the first item in the next section
      updatedProgress = unlockNextSectionFirstItem(courseSections, sectionIndex, updatedProgress);
    }
  }
  
  return updatedProgress;
};

// Calculate the percentage of unlocked items
export const calculateProgressPercentage = (
  courseSections: CourseSection[],
  progress: CourseProgress
): number => {
  let totalItems = 0;
  let unlockedItems = 0;

  // Count total items and unlocked items
  courseSections.forEach((section, sectionIndex) => {
    section.items.forEach((_, itemIndex) => {
      totalItems++;
      
      // Check if the item is unlocked
      if (!isItemLocked(courseSections, sectionIndex, itemIndex, progress)) {
        unlockedItems++;
      }
    });
  });

  // Calculate percentage
  return totalItems > 0 ? Math.round((unlockedItems / totalItems) * 100) : 0;
};

// Get counts of unlocked and total items
export const getItemCounts = (
  courseSections: CourseSection[],
  progress: CourseProgress
): { unlockedCount: number; totalCount: number } => {
  let totalCount = 0;
  let unlockedCount = 0;

  // Count total items and unlocked items
  courseSections.forEach((section, sectionIndex) => {
    section.items.forEach((_, itemIndex) => {
      totalCount++;
      
      // Check if the item is unlocked
      if (!isItemLocked(courseSections, sectionIndex, itemIndex, progress)) {
        unlockedCount++;
      }
    });
  });

  return { unlockedCount, totalCount };
}; 