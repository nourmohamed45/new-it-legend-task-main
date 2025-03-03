import React, { useState, useRef, useEffect } from "react";
import { toggleElementFullscreen, skipVideoTime } from "../../utils/videoUtils";
import VideoControls from "./VideoControls";
import ErrorModal from "./ErrorModal";

interface VideoPlayerProps {
  src?: string;
  poster?: string;
  title?: string;
  isWide?: boolean;
  toggleWide?: () => void;
  sectionIndex?: number;
  itemIndex?: number;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src = "/video/video.mp4",
  poster = "/video/thumbnail.jpg",
  title = "Course Video",
  isWide = false,
  toggleWide = () => {},
  sectionIndex,
  itemIndex,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedOptions, setShowSpeedOptions] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState({
    show: false,
    position: 0,
    time: 0,
  });
  const [videoError, setVideoError] = useState<string | null>(null);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (isPlaying && !isHovering) {
          setShowControls(false);
        }
      }, 3000);
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeout);
    };
  }, [isPlaying, isHovering]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      setCurrentTime(video.currentTime);
      setDuration(video.duration);
    };

    const handleBuffering = () => {
      setIsBuffering(true);
    };

    const handlePlaying = () => {
      setIsBuffering(false);
    };

    const handleEnded = () => {
      if (sectionIndex !== undefined && itemIndex !== undefined) {
        window.dispatchEvent(
          new CustomEvent("video-complete", {
            detail: {
              sectionIndex,
              itemIndex,
            },
          })
        );
        console.log(
          `Video completed: Section ${sectionIndex}, Item ${itemIndex}`
        );
      }
    };

    const handleError = (e: Event) => {
      const videoElement = e.target as HTMLVideoElement;
      const error = videoElement.error;
      console.error("Video error:", error);

      let errorMessage = "An error occurred while playing the video.";
      if (error) {
        switch (error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMessage = "The video playback was aborted.";
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            errorMessage = "A network error caused the video download to fail.";
            break;
          case MediaError.MEDIA_ERR_DECODE:
            errorMessage = "The video could not be decoded.";
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = "The video format is not supported.";
            break;
        }
      }

      setVideoError(errorMessage);
      setIsBuffering(false);
    };

    const handleLoadStart = () => {
      setIsBuffering(true);
      setVideoError(null);
    };

    const handleCanPlay = () => {
      setIsBuffering(false);
    };

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateTime);
    video.addEventListener("waiting", handleBuffering);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("error", handleError);
    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("canplay", handleCanPlay);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateTime);
      video.removeEventListener("waiting", handleBuffering);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("error", handleError);
      video.removeEventListener("loadstart", handleLoadStart);
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, [sectionIndex, itemIndex]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (sectionIndex !== undefined && itemIndex !== undefined) {
      if (videoRef.current) {
        videoRef.current.setAttribute(
          "data-section-index",
          sectionIndex.toString()
        );
        videoRef.current.setAttribute("data-item-index", itemIndex.toString());
      }
    }
  }, [sectionIndex, itemIndex, src]);

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const skipTime = (seconds: number) => {
    if (!videoRef.current) return;
    skipVideoTime(videoRef.current, seconds);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.volume = volume;
    } else {
      videoRef.current.volume = 0;
    }
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (!videoRef.current) return;
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleFullscreen = async () => {
    await toggleElementFullscreen(containerRef.current);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !videoRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;

    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const handleProgressHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const pos = e.clientX - rect.left;
    const percentage = pos / rect.width;
    const previewTime = percentage * duration;

    setThumbnailPreview({
      show: true,
      position: pos,
      time: previewTime,
    });
  };

  const changePlaybackRate = (rate: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSpeedOptions(false);
  };

  return (
    <div
      ref={containerRef}
      className={`relative bg-black video-container mb-8 rounded-xl overflow-hidden shadow-2xl group lg:flex lg:items-center lg:justify-center ${
        isWide ? "w-full" : "w-full"
      } aspect-video group`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        if (isPlaying) {
          setShowControls(false);
        }
      }}
      tabIndex={0}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full"
        onClick={togglePlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      )}

      <VideoControls
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isMuted={isMuted}
        playbackRate={playbackRate}
        isWide={isWide}
        isFullscreen={isFullscreen}
        showControls={showControls}
        showSpeedOptions={showSpeedOptions}
        thumbnailPreview={thumbnailPreview}
        progressRef={progressRef}
        progressBarRef={progressBarRef}
        togglePlay={togglePlay}
        skipTime={skipTime}
        toggleMute={toggleMute}
        handleVolumeChange={handleVolumeChange}
        toggleFullscreen={toggleFullscreen}
        toggleWide={toggleWide}
        handleSeek={handleSeek}
        handleProgressHover={handleProgressHover}
        setThumbnailPreview={setThumbnailPreview}
        setShowSpeedOptions={setShowSpeedOptions}
        changePlaybackRate={changePlaybackRate}
        title={title}
      />

      {videoError && (
        <ErrorModal error={videoError} onClose={() => setVideoError(null)} />
      )}
    </div>
  );
};

export default VideoPlayer;
