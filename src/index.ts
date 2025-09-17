import { Hono } from "hono";

import web from "./web";
import api from "./api";

const app = new Hono();

app.route("/api", api);
app.route("/", web);

export default app;
