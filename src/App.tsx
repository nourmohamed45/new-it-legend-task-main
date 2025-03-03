import { useState, useEffect } from "react";
import Breadcrumb from "./components/Breadcrumb";
import VideoSection from "./components/Video";
import ReferenceSection from "./components/ReferenceSection";
import {
  breadcrumbData,
  comments as initialComments,
  courseData,
} from "./data";
import { CourseMaterials } from "./components/course";
import TopicsCourse from "./components/topics/TopicsCourse";
import CommentsSection, { Comment } from "./components/CommentsSection";
import { courseSections } from "./components/topics/courseData";
import { loadCourseProgress, isItemLocked } from "./components/topics/utils";

// Function to find the first unlocked video
const findFirstUnlockedVideo = () => {
  const courseProgress = loadCourseProgress();

  for (
    let sectionIndex = 0;
    sectionIndex < courseSections.length;
    sectionIndex++
  ) {
    const section = courseSections[sectionIndex];
    for (let itemIndex = 0; itemIndex < section.items.length; itemIndex++) {
      const item = section.items[itemIndex];
      if (
        item.contentType === "video" &&
        !isItemLocked(courseSections, sectionIndex, itemIndex, courseProgress)
      ) {
        return {
          src: item.contentSource ?? "/video/video.mp4",
          poster: item.thumbnail ?? "/video/thumbnail.jpg",
          title: item.title,
          sectionIndex,
          itemIndex,
        };
      }
    }
  }

  // Fallback to default if no unlocked video is found
  return {
    src: "/video/video.mp4",
    poster: "/video/thumbnail.jpg",
    title: "Starting SEO as your Home",
    sectionIndex: undefined,
    itemIndex: undefined,
  };
};

function App() {
  const [isWide, setIsWide] = useState(false);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [studentProgress, setStudentProgress] = useState(0);
  const [videoState, setVideoState] = useState(findFirstUnlockedVideo());

  const toggleWide = () => {
    setIsWide((prev) => !prev);
  };

  // Function to add a new comment
  const addComment = (commentText: string) => {
    const newComment: Comment = {
      id: Date.now(),
      name: "Current User",
      comment: commentText,
      date: new Date().toLocaleDateString(),
      image: "/avatars/man.png", // Default avatar, you might want to use the current user's avatar
    };

    setComments((prevComments) => [...prevComments, newComment]);
  };

  // Function to update student progress
  const handleProgressUpdate = (progress: number) => {
    setStudentProgress(progress);
  };

  // Listen for the custom 'play-video' event from TopicsCourse component
  useEffect(() => {
    const handlePlayVideo = (event: Event) => {
      const customEvent = event as CustomEvent<{
        source: string;
        title: string;
        sectionIndex: number;
        itemIndex: number;
        thumbnail: string;
      }>;
      setVideoState({
        src: customEvent.detail.source,
        poster: customEvent.detail.thumbnail, // Use the thumbnail as the poster
        title: customEvent.detail.title,
        sectionIndex: customEvent.detail.sectionIndex,
        itemIndex: customEvent.detail.itemIndex,
      });

      // Scroll to the video section if needed
      const videoElement = document.querySelector(".video-container");
      if (videoElement) {
        videoElement.scrollIntoView({ behavior: "smooth" });
      }
    };

    window.addEventListener("play-video", handlePlayVideo);

    return () => {
      window.removeEventListener("play-video", handlePlayVideo);
    };
  }, []);

  return (
    <>
      <div className="py-4 px-10 bg-[#f5f9fa]">
        <Breadcrumb items={breadcrumbData} />
        <h2 className="mt-4 font-medium text-2xl">Starting SEO as your Home</h2>
      </div>
      <div className="px-10 py-6">
        {/* Mobile Layout */}
        <div className="flex flex-col lg:hidden">
          <div
            className={`sticky top-0 z-10 ${isWide ? "w-full" : "lg:static"}`}
          >
            <VideoSection
              src={videoState.src}
              poster={videoState.poster}
              title={videoState.title}
              isWide={isWide}
              toggleWide={toggleWide}
              sectionIndex={videoState.sectionIndex}
              itemIndex={videoState.itemIndex}
            />
          </div>
          <ReferenceSection
            onAddQuestion={addComment}
            studentProgress={studentProgress}
            courseName="Starting SEO as your Home"
          />
          <CourseMaterials courseData={courseData} />
          <div className="mt-8">
            <TopicsCourse onProgressUpdate={handleProgressUpdate} />
          </div>
          <div className="mt-8">
            <CommentsSection comments={comments} onAddComment={addComment} />
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          {isWide ? (
            /* Wide Mode Layout */
            <>
              {/* Video Section - Full width */}
              <div className="w-full">
                <VideoSection
                  src={videoState.src}
                  poster={videoState.poster}
                  title={videoState.title}
                  isWide={isWide}
                  toggleWide={toggleWide}
                  sectionIndex={videoState.sectionIndex}
                  itemIndex={videoState.itemIndex}
                />
                <ReferenceSection
                  onAddQuestion={addComment}
                  studentProgress={studentProgress}
                  courseName="Starting SEO as your Home"
                />
              </div>

              {/* Content Section - Grid layout for course materials and topics */}
              <div className="grid grid-cols-3 gap-8 mt-6">
                {/* Course Materials - Takes 2 columns */}
                <div className="col-span-2">
                  <CourseMaterials courseData={courseData} isWide={isWide} />
                  <div className="mt-8">
                    <CommentsSection
                      comments={comments}
                      onAddComment={addComment}
                    />
                  </div>
                </div>

                {/* Topics Course - Takes 1 column */}
                <div className="col-span-1">
                  <TopicsCourse onProgressUpdate={handleProgressUpdate} />
                </div>
              </div>
            </>
          ) : (
            /* Normal Mode Layout */
            <div className="grid grid-cols-3 gap-8">
              {/* Left side - Video and content below it */}
              <div className="col-span-2">
                <VideoSection
                  src={videoState.src}
                  poster={videoState.poster}
                  title={videoState.title}
                  isWide={isWide}
                  toggleWide={toggleWide}
                  sectionIndex={videoState.sectionIndex}
                  itemIndex={videoState.itemIndex}
                />
                <ReferenceSection
                  onAddQuestion={addComment}
                  studentProgress={studentProgress}
                  courseName="Starting SEO as your Home"
                />
                <CourseMaterials courseData={courseData} isWide={isWide} />
                <div className="mt-8">
                  <CommentsSection
                    comments={comments}
                    onAddComment={addComment}
                  />
                </div>
              </div>

              {/* Right side - Topics Course */}
              <div className="col-span-1">
                <TopicsCourse onProgressUpdate={handleProgressUpdate} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
