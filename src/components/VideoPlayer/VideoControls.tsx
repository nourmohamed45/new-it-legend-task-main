import React from "react";
import { formatTime } from "../../utils/videoUtils";
import "./volumeSlider.css"; // Import custom CSS for volume slider

interface VideoControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  isWide: boolean;
  isFullscreen: boolean;
  showControls: boolean;
  showSpeedOptions: boolean;
  thumbnailPreview: {
    show: boolean;
    position: number;
    time: number;
  };
  progressRef: React.RefObject<HTMLDivElement | null>;
  progressBarRef: React.RefObject<HTMLDivElement | null>;
  togglePlay: () => void;
  skipTime: (seconds: number) => void;
  toggleMute: () => void;
  handleVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleFullscreen: () => void;
  toggleWide: () => void;
  handleSeek: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleProgressHover: (e: React.MouseEvent<HTMLDivElement>) => void;
  setThumbnailPreview: React.Dispatch<
    React.SetStateAction<{
      show: boolean;
      position: number;
      time: number;
    }>
  >;
  setShowSpeedOptions: React.Dispatch<React.SetStateAction<boolean>>;
  changePlaybackRate: (rate: number) => void;
  title: string;
}

const VideoControls: React.FC<VideoControlsProps> = ({
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  playbackRate,
  isWide,
  isFullscreen,
  showControls,
  showSpeedOptions,
  thumbnailPreview,
  progressRef,
  progressBarRef,
  togglePlay,
  skipTime,
  toggleMute,
  handleVolumeChange,
  toggleFullscreen,
  toggleWide,
  handleSeek,
  handleProgressHover,
  setThumbnailPreview,
  setShowSpeedOptions,
  changePlaybackRate,
  title,
}) => {
  return (
    <>
      {!isPlaying && (
        <button
          onClick={togglePlay}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110"
          aria-label="Play video"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-red-500 translate-x-0.5"
          >
            <path
              fillRule="evenodd"
              d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
      <div
        className={`absolute bottom-0 left-0 right-0 px-2 py-2 md:px-6 md:py-4 transition-all duration-500 ease-in-out bg-gradient-to-t from-black/50 to-transparent ${
          showControls ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <h3 className="text-white text-sm md:text-base font-medium mb-2 line-clamp-1">{title}</h3>
        <div
          className="relative w-full mb-2 md:mb-4 group"
          onMouseMove={handleProgressHover}
          onMouseLeave={() =>
            setThumbnailPreview({ ...thumbnailPreview, show: false })
          }
        >
          {thumbnailPreview.show && (
            <div
              className="absolute bottom-4 md:bottom-6 bg-white text-gray-800 px-1.5 py-0.5 md:px-2 md:py-1 rounded text-[10px] md:text-xs transform -translate-x-1/2 shadow-lg"
              style={{ left: `${thumbnailPreview.position}px` }}
            >
              {formatTime(thumbnailPreview.time)}
            </div>
          )}

          <div
            ref={progressRef}
            className="w-full h-1 md:h-1.5 bg-white/30 cursor-pointer rounded-full overflow-hidden group-hover:h-1.5 md:group-hover:h-2.5 transition-all duration-200"
            onClick={handleSeek}
          >
            <div
              ref={progressBarRef}
              className="h-full bg-red-500 relative"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 md:w-3 md:h-3 bg-white rounded-full scale-0 group-hover:scale-100 transition-transform duration-200 shadow-md"></div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-5">
            <button
              onClick={() => skipTime(-10)}
              className="text-white opacity-90 hover:opacity-100 hover:scale-110 transition-all duration-200 focus:outline-none"
              aria-label="Skip backward 10 seconds"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 md:h-5 md:w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12.5 8c-2.65 0-5.05 1-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z" />
              </svg>
            </button>

            <button
              onClick={togglePlay}
              className="text-white hover:scale-110 transition-all duration-200 focus:outline-none"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 md:h-6 md:w-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 md:h-6 md:w-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>

            <button
              onClick={() => skipTime(10)}
              className="text-white opacity-90 hover:opacity-100 hover:scale-110 transition-all duration-200 focus:outline-none"
              aria-label="Skip forward 10 seconds"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 md:h-5 md:w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.92 6.01C17.96 4.76 16.43 4 14.7 4c-1.97 0-3.76 1-4.86 2.62l-7.39-1.02L4 14.1l7.41-1.03C12.21 14.92 13.31 16 14.7 16c1.5 0 2.85-.63 3.82-1.64l3.58 3.58L24 16l-3.59-3.59c.93-1.69.98-3.74.51-6.4zM14.7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
              </svg>
            </button>

            <div className="flex items-center space-x-1 md:space-x-2 group relative">
              <button
                onClick={toggleMute}
                className="text-white opacity-90 hover:opacity-100 transition-all duration-200 focus:outline-none"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 md:h-5 md:w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M3.63 3.63a.996.996 0 000 1.41L7.29 8.7 7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18c-.49.37-1.02.68-1.6.91-.36.15-.58.53-.58.92 0 .72.73 1.18 1.39.91.8-.33 1.55-.77 2.22-1.31l1.34 1.34a.996.996 0 101.41-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-3.83-2.4-7.11-5.78-8.4-.59-.23-1.22.23-1.22.86v.19c0 .38.25.71.61.85C17.18 6.54 19 9.06 19 12zm-8.71-6.29l-.17.17L12 7.76V6.41c0-.89-1.08-1.33-1.71-.7zM16.5 12A4.5 4.5 0 0014 7.97v1.79l2.48 2.48c.01-.08.02-.16.02-.24z" />
                  </svg>
                ) : volume < 0.5 ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 md:h-5 md:w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 md:h-5 md:w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                )}
              </button>
              <div className="w-0 overflow-hidden group-hover:w-12 md:group-hover:w-16 transition-all duration-300 flex items-center justify-center h-6">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-12 md:w-16 h-1 md:h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-red-500"
                  style={{
                    background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${(isMuted ? 0 : volume) * 100}%, rgba(255, 255, 255, 0.3) ${(isMuted ? 0 : volume) * 100}%, rgba(255, 255, 255, 0.3) 100%)`
                  }}
                  aria-label="Volume"
                />
              </div>
            </div>

            <div className="text-white text-[10px] md:text-xs font-medium">
              <span className="opacity-100">{formatTime(currentTime)}</span>
              <span className="opacity-70"> / {formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="relative">
              <button
                onClick={() => setShowSpeedOptions(!showSpeedOptions)}
                className="text-white text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 focus:outline-none"
                aria-label="Playback Speed"
              >
                {playbackRate}x
              </button>

              {showSpeedOptions && (
                <div className="absolute bottom-full right-0 mb-2 bg-black/80 backdrop-blur-sm rounded-lg p-2 z-10">
                  {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => changePlaybackRate(rate)}
                      className={`block w-full text-left px-3 py-1 text-xs md:text-sm rounded hover:bg-white/10 ${
                        playbackRate === rate ? "text-red-500" : "text-white"
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={toggleWide}
              className="text-white opacity-90 hover:opacity-100 transition-colors duration-200 focus:outline-none"
              aria-label={isWide ? "Exit wide mode" : "Enter wide mode"}
            >
              {isWide ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 md:h-5 md:w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 12h-2v3h-3v2h5v-5zM7 9h3V7H5v5h2V9zm14-6H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16.01H3V4.99h18v14.02z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 md:h-5 md:w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20 4h-6v2h4v12h-4v2h6V4zM4 4v16h6v-2H6V6h4V4H4z" />
                </svg>
              )}
            </button>

            <button
              onClick={toggleFullscreen}
              className="text-white opacity-90 hover:opacity-100 transition-colors duration-200 focus:outline-none"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 md:h-5 md:w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 md:h-5 md:w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoControls;
