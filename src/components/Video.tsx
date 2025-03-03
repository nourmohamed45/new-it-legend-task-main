import React from "react";
import VideoPlayer from "./VideoPlayer";

interface VideoSectionProps {
  src?: string;
  poster?: string;
  title?: string;
  isWide?: boolean;
  toggleWide?: () => void;
  sectionIndex?: number;
  itemIndex?: number;
}

const VideoSection: React.FC<VideoSectionProps> = (props) => {
  return <VideoPlayer {...props} />;
};

export default VideoSection;
