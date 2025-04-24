import {
	createKindeServerClient,
	GrantType,
	type SessionManager,
	type UserType,
} from "@kinde-oss/kinde-typescript-sdk";
import { type Context } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";

export const kindeClient = createKindeServerClient(
	GrantType.AUTHORIZATION_CODE,
	{
		authDomain: process.env.KINDE_ISSUER_URL!,
		clientId: process.env.KINDE_CLIENT_ID!,
		clientSecret: process.env.KINDE_CLIENT_SECRET!,
		redirectURL: process.env.KINDE_REDIRECT_URL!,
		logoutRedirectURL: process.env.KINDE_LOGOUT_REDIRECT_URL!,
	}
);

let store: Record<string, unknown> = {};

export const sessionManager = (c: Context): SessionManager => ({
	async getSessionItem(key: string) {
		const result = getCookie(c, key);
		console.log(`Getting ${key}:`, result ? "exists" : "missing");
		return result;
	},
	async setSessionItem(key: string, value: unknown) {
		console.log(`Setting ${key}`);
		const cookieOptions = {
			httpOnly: true,
			secure: true,
			sameSite: "Lax",
			path: "/",
			maxAge: 60 * 60 * 24 * 7, // 1 week
		} as const;

		if (typeof value === "string") {
			await setCookie(c, key, value, cookieOptions);
		} else {
			await setCookie(c, key, JSON.stringify(value), cookieOptions);
		}
	},
	async removeSessionItem(key: string) {
		deleteCookie(c, key, { path: "/" });
	},
	async destroySession() {
		["id_token", "access_token", "user", "refresh_token"].forEach((key) => {
			deleteCookie(c, key, { path: "/" });
		});
	},
});

type Env = {
	Variables: { user: UserType };
};

export const getUser = createMiddleware<Env>(async (c, next) => {
	try {
		const manager = sessionManager(c);
		const isAuthenticated = await kindeClient.isAuthenticated(manager);
		if (!isAuthenticated) {
			return c.json({ error: "Unauthorized" }, 401);
		}

		const user = await kindeClient.getUserProfile(manager);
		c.set("user", user);
		await next();
	} catch (e) {
		console.error(e);
		return c.json({ error: "Unauthorized" }, 401);
	}
});
