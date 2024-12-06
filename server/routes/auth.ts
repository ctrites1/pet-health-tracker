import { Hono } from "hono";
import { kindeClient, sessionManager } from "server/kinde";

export const authRoute = new Hono()
	.get("/login", async (c) => {
		const loginUrl = await kindeClient.login(sessionManager);
		return c.redirect(loginUrl.toString());
	})

	.get("/register", async (c) => {
		const registerUrl = await kindeClient.register(sessionManager);
		return c.redirect(registerUrl.toString());
	});
