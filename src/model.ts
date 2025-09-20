import { z } from "zod";

const METADATA_FILENAME = "metadata.v1.json";
const CHARTDATA_FILENAME = "chart_data.json";

export const MetadataSchema = z.object({
  title: z.string(),
  showImage: z.boolean(),
  showPanorama: z.boolean(),
  showNightTimelapse: z.boolean(),
  showDayTimelapse: z.boolean(),
});

export const ChartDataItemSchema = z.object({
  timestamp: z.iso.datetime({ offset: true }),
  temperature: z.number(),
  humidity: z.number(),
  sqm: z.number(),
  wind: z.number(),
});

export const ChartDataSchema = z.object({
  version: z.number(),
  data: z.array(ChartDataItemSchema),
});

export interface Metadata {
  title: string;
  showImage: boolean;
  showPanorama: boolean;
  showNightTimelapse: boolean;
  showDayTimelapse: boolean;
}

export interface ChartDataItem {
  timestamp: Date;
  temperature: number;
  humidity: number;
  sqm: number;
  wind: number;
}

export interface ChartData {
  version: number;
  data: ChartDataItem[];
}

export const getMetadata = async (BUCKET: R2Bucket): Promise<Metadata | undefined> => {
  const value = await BUCKET.get(METADATA_FILENAME);
  if (!value) return;
  return await value.json<Metadata>();
};

export const setMetadata = async (BUCKET: R2Bucket, param: Metadata): Promise<void> => {
  await BUCKET.put(METADATA_FILENAME, JSON.stringify(param));
};

export const getChartData = async (BUCKET: R2Bucket): Promise<ChartData | undefined> => {
  const value = await BUCKET.get(CHARTDATA_FILENAME);
  if (!value) return;
  return await value.json<ChartData>();
};

export const setChartData = async (BUCKET: R2Bucket, param: ChartData): Promise<void> => {
  await BUCKET.put(CHARTDATA_FILENAME, JSON.stringify(param));
};
