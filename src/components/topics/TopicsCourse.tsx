import { useState, useEffect } from "react";
import { CourseItem } from "./types";
import Modal from "./Modal";
import CourseSection from "./CourseSection";
import { courseSections } from "./courseData";
import {
  loadCourseProgress,
  saveCourseProgress,
  completeItem,
  isItemLocked,
  CourseProgress,
  calculateProgressPercentage,
  getItemCounts,
  unlockNextSectionsIfNeeded,
} from "./utils";

interface TopicsCourseProps {
  onProgressUpdate?: (progress: number) => void;
}

const TopicsCourse = ({ onProgressUpdate }: TopicsCourseProps) => {
  const [courseProgress, setCourseProgress] = useState<CourseProgress>(() =>
    loadCourseProgress()
  );
  const [progress, setProgress] = useState(0);
  const [itemCounts, setItemCounts] = useState({
    unlockedCount: 0,
    totalCount: 0,
  });
  const [expandedSections, setExpandedSections] = useState<number[]>([0]); // Track which sections are expanded
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    contentType: "video" | "pdf" | "exam" | "default";
    contentSource?: string;
    examId?: string;
    sectionIndex?: number;
    itemIndex?: number;
  }>({
    isOpen: false,
    title: "",
    contentType: "default",
    contentSource: "",
    examId: "",
  });

  // Initialize progress when component mounts
  useEffect(() => {
    // Load saved progress
    const savedProgress = loadCourseProgress();

    // Check if any sections need to have their next section's first item unlocked
    const updatedProgress = unlockNextSectionsIfNeeded(
      courseSections,
      savedProgress
    );

    // Save the updated progress
    saveCourseProgress(updatedProgress);
    setCourseProgress(updatedProgress);

    // Calculate progress percentage
    const progressPercentage = calculateProgressPercentage(
      courseSections,
      updatedProgress
    );
    setProgress(progressPercentage);

    // Notify parent component of progress update
    if (onProgressUpdate) {
      onProgressUpdate(progressPercentage);
    }

    // Calculate item counts
    const counts = getItemCounts(courseSections, updatedProgress);
    setItemCounts(counts);
  }, [onProgressUpdate]);

  // Update progress whenever courseProgress changes
  useEffect(() => {
    // Check if any sections need to have their next section's first item unlocked
    const updatedProgress = unlockNextSectionsIfNeeded(
      courseSections,
      courseProgress
    );

    // Only update the state if the progress has changed
    if (JSON.stringify(updatedProgress) !== JSON.stringify(courseProgress)) {
      setCourseProgress(updatedProgress);
      return; // Skip the rest, as the state update will trigger this useEffect again
    }

    const progressPercentage = calculateProgressPercentage(
      courseSections,
      courseProgress
    );
    setProgress(progressPercentage);

    // Notify parent component of progress update
    if (onProgressUpdate) {
      onProgressUpdate(progressPercentage);
    }

    const counts = getItemCounts(courseSections, courseProgress);
    setItemCounts(counts);

    // Save progress when component unmounts
    return () => {
      saveCourseProgress(courseProgress);
    };
  }, [courseProgress, onProgressUpdate]);

  // Function to handle item click
  const handleItemClick = (
    item: CourseItem,
    sectionIndex: number,
    itemIndex: number
  ) => {
    // Check if the item is locked based on our progress tracking
    if (isItemLocked(courseSections, sectionIndex, itemIndex, courseProgress)) {
      return; // Don't do anything if the item is locked
    }

    if (item.contentType === "video" && item.contentSource) {
      // Handle video content - we'll need to communicate with the parent component
      console.log("Opening video:", item.contentSource);
      // You would typically use a callback prop or context to communicate with the video player
      window.dispatchEvent(
        new CustomEvent("play-video", {
          detail: {
            source: item.contentSource,
            title: item.title,
            sectionIndex,
            itemIndex,
            thumbnail: item.thumbnail || "/video/thumbnail.jpg", // Include thumbnail or default
          },
        })
      );
    } else if (item.contentType === "pdf" && item.contentSource) {
      // Open PDF in modal
      setModalState({
        isOpen: true,
        title: item.title,
        contentType: "pdf",
        contentSource: item.contentSource,
        sectionIndex,
        itemIndex,
      });

      // Mark PDF as completed when opened
      const updatedProgress = completeItem(
        courseSections,
        sectionIndex,
        itemIndex,
        courseProgress
      );
      setCourseProgress(updatedProgress);
    } else if (item.contentType === "exam") {
      // Open exam in modal
      setModalState({
        isOpen: true,
        title: item.title,
        contentType: "exam",
        examId: item.examId,
        sectionIndex,
        itemIndex,
      });
    }
  };

  // Close modal
  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  // Handle exam completion
  const handleExamComplete = (passed: boolean) => {
    if (
      passed &&
      modalState.sectionIndex !== undefined &&
      modalState.itemIndex !== undefined
    ) {
      const updatedProgress = completeItem(
        courseSections,
        modalState.sectionIndex,
        modalState.itemIndex,
        courseProgress
      );
      setCourseProgress(updatedProgress);
      closeModal();
    }
    // If not passed, the ExamInterface will handle showing the "Try Again" button
    // The modal will be closed when the user clicks "Continue" or "Close" in the ExamInterface
  };

  // Listen for video completion events
  useEffect(() => {
    const handleVideoComplete = (event: Event) => {
      const customEvent = event as CustomEvent<{
        sectionIndex: number;
        itemIndex: number;
      }>;

      const { sectionIndex, itemIndex } = customEvent.detail;

      const updatedProgress = completeItem(
        courseSections,
        sectionIndex,
        itemIndex,
        courseProgress
      );
      setCourseProgress(updatedProgress);
    };

    window.addEventListener("video-complete", handleVideoComplete);

    return () => {
      window.removeEventListener("video-complete", handleVideoComplete);
    };
  }, [courseProgress]);

  // Toggle section expansion
  const toggleSection = (index: number) => {
    setExpandedSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="max-w-md" id="curriculum">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-medium text-gray-800">
          Topics for This Course
        </h2>
        <div className="text-sm text-gray-600">Progress: {progress}%</div>
      </div>

      {/* Progress bar */}
      <div className="relative h-1 bg-gray-200 rounded-full my-14">
        <div
          className="you-indicator text-xs text-[#535D9A] absolute -top-8 border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center bg-white shadow-md transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${progress}%` }}
        >
          You
        </div>
        <div
          className="absolute top-0 h-1 bg-green-500 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
        <div
          className="absolute top-4 text-xs text-[#535D9A] transform -translate-x-1/2"
          style={{ left: `${progress}%` }}
        >
          {progress}% Unlocked ({itemCounts.unlockedCount}/
          {itemCounts.totalCount})
        </div>
      </div>

      {/* Course sections */}
      {courseSections.map((section, sectionIndex) => (
        <CourseSection
          key={sectionIndex}
          section={section}
          sectionIndex={sectionIndex}
          isExpanded={expandedSections.includes(sectionIndex)}
          onToggle={() => toggleSection(sectionIndex)}
          onItemClick={handleItemClick}
          courseProgress={courseProgress}
        />
      ))}

      {/* Modal for PDF and Exam */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        contentType={modalState.contentType}
        contentSource={modalState.contentSource}
        examId={modalState.examId}
        onExamComplete={handleExamComplete}
      />
    </div>
  );
};

export default TopicsCourse;
