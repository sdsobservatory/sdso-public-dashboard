import { useEffect, useState } from "hono/jsx";

export interface AllskyViewerProps {
  url: string;
}

export const AllskyViewer = (props: AllskyViewerProps) => {
  const [imgSrc, setImgSrc] = useState<string>(props.url);

  const reloadImg = () => {
    // timestamp for cache busting
    setImgSrc(`${props.url}?time=${Date.now()}`);
  };

  useEffect(() => {
    const oneMinute = 60000;
    const interval = setInterval(reloadImg, oneMinute);
    return () => clearInterval(interval);
  });

  return (
    <div class="card border shadow rounded-2 overflow-hidden">
      <div class="card-img">
        <img src={imgSrc} style="width: 100%;" alt="All Sky Image" />
      </div>
    </div>
  );
};
