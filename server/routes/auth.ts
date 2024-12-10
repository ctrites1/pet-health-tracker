import { Hono } from "hono";
import { kindeClient, sessionManager } from "server/kinde";
import { getUser } from "server/kinde";
import { db } from "server/db";
import { users as usersTable, userInsertSchema } from "server/db/schema/users";
import { eq } from "drizzle-orm";

export const authRoute = new Hono()
	.get("/login", async (c) => {
		try {
			const loginUrl = await kindeClient.login(sessionManager(c));
			return c.text(loginUrl.toString());
		} catch (error) {
			console.error("Login URL generation error:", error);
			return c.json({ error: "Failed to generate login URL" }, 500);
		}
	})

	.get("/register", async (c) => {
		const registerUrl = await kindeClient.register(sessionManager(c));
		return c.redirect(registerUrl.toString());
	})

	.get("/callback", async (c) => {
		try {
			const url = new URL(c.req.url);
			console.log("Callback URL:", url.toString()); // Debug logging
			const code = url.searchParams.get("code"); // more debugging
			if (!code) {
				console.error("No auth code found in callback URL");
				return c.redirect("/login?error=no_code");
			}
			await kindeClient.handleRedirectToApp(sessionManager(c), url);

			const profile = await kindeClient.getUserProfile(sessionManager(c));

			if (profile) {
				const [existingUser] = await db
					.select()
					.from(usersTable)
					.where(eq(usersTable.id, profile.id));

				const userData = {
					id: profile.id,
					name: profile.given_name || profile.email.split("@")[0],
					email: profile.email,
				};

				const parsedUser = userInsertSchema.parse(userData);

				if (!existingUser) {
					await db.insert(usersTable).values(parsedUser);
				} else {
					await db
						.update(usersTable)
						.set(parsedUser)
						.where(eq(usersTable.id, profile.id));
				}
			}

			return c.redirect("/");
		} catch (e) {
			console.error("Auth callback error: ", e);
			return c.redirect("/login?error=auth_callback_failed");
		}
	})

	.get("/logout", async (c) => {
		const logoutUrl = await kindeClient.logout(sessionManager(c));
		return c.redirect(logoutUrl.toString());
	})

	.get("/me", getUser, async (c) => {
		const user = c.var.user;
		return c.json({ user: user });
	});
