import { useEffect, useRef } from "hono/jsx";
import videojs from "video.js";
import "video.js/dist/video-js.css";

export interface TimelapseProps {
  url: string;
  title: string;
}

export const TimelapseViewer = (props: TimelapseProps) => {
  const videoRef = useRef<any | null>(null);
  const playerRef = useRef<any | null>(null);

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current.appendChild(videoElement);
      playerRef.current = videojs(videoElement, {
        fluid: true,
        autoplay: false,
        controls: true,
        loop: true,
        preload: "metadata",
        enableSmoothSeeking: true,
        playbackRates: [0.5, 1, 1.5, 2],
        sources: [
          {
            src: props.url,
            type: "video/mp4",
          },
        ],
      });
    }
  }, [videoRef]);

  useEffect(() => {
    const player = playerRef.current;
    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div class="col-12">
      <div class="card border shadow rounded-2 overflow-hidden mt-4">
        <div class="card-header text-center fw-bold">{props.title}</div>
        <div class="card-img" data-vjs-player>
          <div ref={videoRef} />
        </div>
      </div>
    </div>
  );
};
