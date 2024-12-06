import { serve } from "bun";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => c.text("Hello, Hono!"));

const port = 3000;

serve({
	fetch: app.fetch,
	port: port,
});

console.log(`Server is running on http://localhost:${port}`);
