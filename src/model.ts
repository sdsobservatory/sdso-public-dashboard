import { z } from "zod";

const METADATA_FILENAME = "metadata.v1.json";

export const MetadataSchema = z.object({
  title: z.string(),
  showImage: z.boolean(),
  showPanorama: z.boolean(),
  showNightTimelapse: z.boolean(),
  showDayTimelapse: z.boolean(),
});

export interface Metadata {
  title: string;
  showImage: boolean;
  showPanorama: boolean;
  showNightTimelapse: boolean;
  showDayTimelapse: boolean;
}

export const getMetadata = async (BUCKET: R2Bucket): Promise<Metadata | undefined> => {
  const value = await BUCKET.get(METADATA_FILENAME);
  if (!value) return;
  return await value.json<Metadata>();
};

export const setMetadata = async (BUCKET: R2Bucket, param: Metadata): Promise<void> => {
  await BUCKET.put(METADATA_FILENAME, JSON.stringify(param));
};
