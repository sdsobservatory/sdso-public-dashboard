import { type Context, Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { validator } from "hono/validator";
import { type Metadata, MetadataSchema, getMetadata, setMetadata } from "./model";
import { type ChartData, ChartDataSchema, getChartData, setChartData } from "./model";

type Bindings = {
  LUMISKY_API_KEY: string;
  BUCKET: R2Bucket;
};

const api = new Hono<{ Bindings: Bindings }>();

async function getFromR2(c: Context, key: string): Promise<Response> {
  const obj: R2ObjectBody | null = await c.env.BUCKET.get(key);
  if (!obj) {
    return c.notFound();
  }
  c.header("ETag", obj.etag);
  c.header("Content-Length", obj.size.toString());
  c.header("Content-Type", obj.httpMetadata?.contentType ?? "");
  return c.body(obj.body);
}

api.use(
  "/check",
  bearerAuth({
    verifyToken: async (token, c) => {
      return token === c.env.LUMISKY_API_KEY;
    },
  }),
);

api.use(
  "/upload/*",
  bearerAuth({
    verifyToken: async (token, c) => {
      return token === c.env.LUMISKY_API_KEY;
    },
  }),
);

api.on("POST", "/metadata", async (c, next) => {
  const bearer = bearerAuth({ token: c.env.LUMISKY_API_KEY });
  return bearer(c, next);
});

api.on("POST", "/chart", async (c, next) => {
  const bearer = bearerAuth({ token: c.env.LUMISKY_API_KEY });
  return bearer(c, next);
});

api.get("/check", (c) => {
  return c.text("");
});

api.get("/image", async (c) => {
  return await getFromR2(c, "latest_image");
});

api.get("/panorama", async (c) => {
  return await getFromR2(c, "latest_panorama");
});

api.get("/timelapse-day", async (c) => {
  return await getFromR2(c, "latest_day_timelapse");
});

api.get("/timelapse-night", async (c) => {
  return await getFromR2(c, "latest_night_timelapse");
});

api.get("/metadata", async (c) => {
  const metadata = await getMetadata(c.env.BUCKET);
  return c.json(metadata);
});

api.post(
  "/metadata",
  validator("json", async (value, c) => {
    const parsed = await MetadataSchema.safeParseAsync(value);
    if (!parsed.success) {
      return c.json({ success: false, error: parsed.error }, 422);
    }
    return parsed.data;
  }),
  async (c) => {
    const param: Metadata = await c.req.json();
    await setMetadata(c.env.BUCKET, param);
    return c.json({ success: true, error: {} });
  },
);

api.post("/upload/:key", async (c) => {
  const MaxSize: number = 200 * 1024 * 1024; // 200MB;
  const MimeTypes: string[] = ["image/jpeg", "image/png", "video/mp4", "application/json"];

  const errors: string[] = [];
  const key: string = c.req.param("key");
  const form: FormData = await c.req.formData();
  const formFile: FormDataEntryValue | null = form.get("file");

  if (!(formFile instanceof File)) {
    errors.push(`${key}: not a file [${typeof formFile}]`);
    console.log(errors.at(-1));
  }

  if (errors.length === 0) {
    const file: File = formFile as File;

    if (file.size > MaxSize) {
      errors.push(`${key}: exceeds max size`);
      console.log(errors.at(-1));
    }

    if (!MimeTypes.includes(file.type.toLowerCase())) {
      errors.push(`${key}: type not accepted`);
      console.log(errors.at(-1));
    }

    if (errors.length === 0) {
      const data = await file.arrayBuffer();
      const obj: R2Object = await c.env.BUCKET.put(key, data, {
        httpMetadata: { contentType: file.type },
      });
      c.res.headers.set("ETag", obj.etag);
    }
  }

  if (errors.length > 0) {
    c.status(400);
  }

  return c.json({ success: errors.length === 0, errors: errors });
});

api.get("/chart", async (c) => {
  const chartData = await getChartData(c.env.BUCKET);
  return c.json(chartData);
});

api.post(
  "/chart",
  validator("json", async (value, c) => {
    const parsed = await ChartDataSchema.safeParseAsync(value);
    if (!parsed.success) {
      return c.json({ success: false, error: parsed.error }, 422);
    }
    return parsed.data;
  }),
  async (c) => {
    const param: ChartData = await c.req.json();
    await setChartData(c.env.BUCKET, param);
    return c.json({ success: true, error: {} });
  },
);

export default api;
