import {
	createKindeServerClient,
	GrantType,
} from "@kinde-oss/kinde-typescript-sdk";
import type { SessionManager } from "@kinde-oss/kinde-typescript-sdk";

export const kindeClient = createKindeServerClient(
	GrantType.AUTHORIZATION_CODE,
	{
		authDomain: process.env.KINDE_AUTH_DOMAIN!,
		clientId: process.env.KINDE_CLIENT_ID!,
		clientSecret: process.env.KINDE_SECRET!,
		redirectURL: process.env.KINDE_REDIRECT_URL!,
		logoutRedirectURL: process.env.KINDE_LOGOUT_REDIRECT_URL!,
	}
);

let store: Record<string, unknown> = {};

// TODO: Change this to cookies
// import { type Context } from "hono";
// import { getCookie, setCookie, deleteCookie } from "hono/cookie";
export const sessionManager: SessionManager = {
	async getSessionItem(key: string) {
		return store[key];
	},
	async setSessionItem(key: string, value: unknown) {
		store[key] = value;
	},
	async removeSessionItem(key: string) {
		delete store[key];
	},
	async destroySession() {
		store = {};
	},
};
