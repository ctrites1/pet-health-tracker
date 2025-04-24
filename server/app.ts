import { Hono } from "hono";
import { logger } from "hono/logger";
import { petsRoute } from "./routes/petRoutes";
import { serveStatic } from "hono/bun";
import { authRoute } from "./routes/auth";

const app = new Hono();

app.use("*", logger());

const apiRoutes = app
	.basePath("/api")
	.route("/pets", petsRoute)
	.route("/", authRoute);

app.get("*", serveStatic({ root: "./client/dist" }));
app.get("*", serveStatic({ path: "./client/dist/index.html" }));

export default app;
export type ApiRoutes = typeof apiRoutes;
