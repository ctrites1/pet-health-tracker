import { Hono } from "hono";
import { logger } from "hono/logger";
import { petsRoute } from "./routes/petRoutes";

const app = new Hono();

app.use("*", logger());

app.get("/test", (c) => {
	return c.json({ message: "test" });
});

app.route("/api/pets", petsRoute);

export default app;
