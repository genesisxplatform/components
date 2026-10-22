import { forwardRef, useCallback, useState, type VideoHTMLAttributes } from 'react';
import { useLazyVideos } from '../../utils/useLazyVideos';

type LazyVideoProps = Omit<VideoHTMLAttributes<HTMLVideoElement>, 'preload'> & {
  nearPreload?: 'auto' | 'metadata';
};

// GX keeps 1.0.1's loading: a video renders with its full preload level and the autoplay
// attribute, so it downloads (and starts playing) straight from the HTML. useLazyVideos only
// pauses it while it is off screen and resumes it when it comes back.
export const LazyVideo = forwardRef<HTMLVideoElement, LazyVideoProps>(({ autoPlay = false, nearPreload = 'auto', ...props }, ref) => {
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  useLazyVideos(video, { autoPlay, preload: nearPreload });
  const setRefs = useCallback((element: HTMLVideoElement | null) => {
    setVideo(element);
    if (typeof ref === 'function') ref(element);
    else if (ref) ref.current = element;
  }, [ref]);

  return <video {...props} ref={setRefs} preload={nearPreload} autoPlay={autoPlay} />;
});

LazyVideo.displayName = 'LazyVideo';
