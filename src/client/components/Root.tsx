import { StrictMode, useEffect, useState } from "hono/jsx";
import { Layout } from "./Layout";
import { Title } from "./Title";
import { AllskyViewer } from "./AllskyViewer";
import { PanoramaViewer } from "./PanoramaViewer";
import { TimelapseViewer } from "./TimelapseViewer";
import type { Metadata } from "../../model";

export const Root = () => {
  const [title, setTitle] = useState<string>("LumiSky - All Sky");
  const [metadata, setMetadata] = useState<Metadata>({
    title: "LumiSky All Sky",
    showImage: false,
    showPanorama: false,
    showNightTimelapse: false,
    showDayTimelapse: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/metadata");
      if (response.ok) {
        const newMetadata = await response.json<Metadata>();
        console.log(newMetadata);
        setMetadata(newMetadata);
        setTitle(newMetadata.title);
      }
    };

    fetchData();
  }, []);

  return (
    <StrictMode>
      <Layout>
        <Title title={title} />
        {metadata.showImage && <AllskyViewer url="/api/image" />}
        {metadata.showPanorama && <PanoramaViewer url="/api/panorama" />}
        {metadata.showNightTimelapse && (
          <TimelapseViewer url="/api/timelapse-night" title="Night Timelapse" />
        )}
        {metadata.showDayTimelapse && (
          <TimelapseViewer url="/api/timelapse-day" title="Day Timelapse" />
        )}
      </Layout>
    </StrictMode>
  );
};
