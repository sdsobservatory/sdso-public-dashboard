import { StrictMode, useEffect, useState } from "hono/jsx";
import { Layout } from "./Layout";
import { Title } from "./Title";
import { AllskyViewer } from "./AllskyViewer";
import { PanoramaViewer } from "./PanoramaViewer";
import { TimelapseViewer } from "./TimelapseViewer";
import { ObsChart, type ChartPoint } from "./ObsChart";
import type { Metadata, ChartData } from "../../model";

export const Root = () => {
  const [title, setTitle] = useState<string>("LumiSky All Sky");
  const [metadata, setMetadata] = useState<Metadata>({
    title: "LumiSky All Sky",
    showImage: false,
    showPanorama: false,
    showNightTimelapse: false,
    showDayTimelapse: false,
  });

  const [sqmData, setSqmData] = useState<ChartPoint[]>([]);
  const [temperatureData, setTemperatureData] = useState<ChartPoint[]>([]);
  const [humidityData, setHumidityData] = useState<ChartPoint[]>([]);
  const [windData, setWindData] = useState<ChartPoint[]>([]);

  useEffect(() => {
    const fetchImageMetadata = async () => {
      const response = await fetch("/api/metadata");
      if (response.ok && response.body) {
        try {
          const newMetadata = await response.json<Metadata>();
          setMetadata(newMetadata);
          setTitle(newMetadata.title);
        } catch (e) {
          console.error("Error parsing image metadata:", e);
        }
      }
    };

    const fetchChartData = async () => {
      const response = await fetch("/api/chart");
      if (response.ok) {
        const chartData = await response.json<ChartData>();
        try {
          setSqmData(
            chartData.data.map((item) => ({
              x: item.timestamp,
              y: item.sqm,
            })),
          );
          setTemperatureData(
            chartData.data.map((item) => ({
              x: item.timestamp,
              y: item.temperature,
            })),
          );
          setHumidityData(
            chartData.data.map((item) => ({
              x: item.timestamp,
              y: item.humidity,
            })),
          );
          setWindData(
            chartData.data.map((item) => ({
              x: item.timestamp,
              y: item.wind,
            })),
          );
        } catch (e) {
          console.error("Error parsing chart data:", e);
        }
      }
    };

    fetchImageMetadata();
    fetchChartData();
  }, []);

  return (
    <StrictMode>
      <Layout>
        <Title title={title} />
        {sqmData.length > 0 && (
          <ObsChart data={sqmData} title="SQM (mag/arcsec²)" ymin={16} ymax={24} />
        )}
        {temperatureData.length > 0 && <ObsChart data={temperatureData} title="Temperature (°C)" />}
        {humidityData.length > 0 && (
          <ObsChart data={humidityData} title="Humidity (%)" ymin={0} ymax={100} />
        )}
        {windData.length > 0 && <ObsChart data={windData} title="Wind (mph)" ymin={0} />}
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
