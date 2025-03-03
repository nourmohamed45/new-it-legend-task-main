/**
 * Formats a time in seconds to a string in the format "minutes:seconds"
 * @param time Time in seconds
 * @returns Formatted time string
 */
export const formatTime = (time: number): string => {
  if (isNaN(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

/**
 * Toggles fullscreen mode for a given element
 * @param element The element to toggle fullscreen for
 * @returns Promise that resolves when fullscreen is toggled
 */
export const toggleElementFullscreen = async (element: HTMLElement | null): Promise<void> => {
  if (!element) return;

  if (!document.fullscreenElement) {
    const requestFullscreen =
      element.requestFullscreen ||
      (element as any).webkitRequestFullscreen ||
      (element as any).mozRequestFullScreen ||
      (element as any).msRequestFullscreen;

    if (requestFullscreen) {
      try {
        await requestFullscreen.call(element);
      } catch (err) {
        console.error(`Error enabling fullscreen: ${(err as Error).message}`);
      }
    }
  } else {
    const exitFullscreen =
      document.exitFullscreen ||
      (document as any).webkitExitFullscreen ||
      (document as any).mozCancelFullScreen ||
      (document as any).msExitFullscreen;

    if (exitFullscreen) {
      await exitFullscreen.call(document);
    }
  }
};

/**
 * Skips the video time by a given number of seconds
 * @param video The video element
 * @param seconds The number of seconds to skip (can be negative)
 */
export const skipVideoTime = (video: HTMLVideoElement | null, seconds: number): void => {
  if (!video) return;

  video.currentTime = Math.min(
    Math.max(video.currentTime + seconds, 0),
    video.duration
  );
}; 