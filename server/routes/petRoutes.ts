import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { db } from "../db";
import { pets as petsTable, insertPetSchema } from "server/db/schema/pets";
import { eq, sql } from "drizzle-orm";
import { getUser } from "server/kinde";
import { createPetSchema } from "server/sharedTypes";

export const petsRoute = new Hono()
	.get("/", getUser, async (c) => {
		try {
			const user = c.var.user;
			const pets = await db
				.select()
				.from(petsTable)
				.where(eq(petsTable.ownerId, user.id));
			console.log("pets: ", pets);

			return c.json({ pets: pets, success: true });
		} catch (e) {
			console.log("Fetching pets error: ", e);
			return c.json({ success: false, error: "Failed to fetch pets" }, 500);
		}
	})
	.post("/", getUser, zValidator("json", createPetSchema), async (c) => {
		const newPet = await c.req.valid("json");
		const user = c.var.user;

		const validatedPet = insertPetSchema.parse({
			...newPet,
			dateOfBirth: newPet.dateOfBirth?.toString(),
			weight: newPet.weight?.toString(),
			ownerId: user.id,
		});

		const result = await db.insert(petsTable).values(validatedPet).returning();

		c.status(201);
		return c.json(result);
	})
	.get("/:id{[0-9]+}", getUser, async (c) => {
		const paramId = Number.parseInt(c.req.param("id"));

		const result = await db
			.select()
			.from(petsTable)
			.where(eq(petsTable.id, paramId));
		const { id, name, species, breed, dateOfBirth, weight, ownerId, imageUrl } =
			result[0];

		return c.json({
			id: id,
			name: name,
			species: species,
			breed: breed,
			dateOfBirth: dateOfBirth,
			weight: weight,
			ownerId: ownerId,
			imageUrl: imageUrl,
		});
	})
	.delete("/:id{[0-9]+}", getUser, async (c) => {
		const paramId = Number.parseInt(c.req.param("id"));

		const petToDelete = await db
			.select()
			.from(petsTable)
			.where(eq(petsTable.id, paramId));

		await db.delete(petsTable).where(eq(petsTable.id, paramId));

		return c.json({ deletedPet: petToDelete });
	})
	.get("/all-species", getUser, async (c) => {
		try {
			const user = c.var.user;

			const speciesCounts = await db
				.select({
					species: petsTable.species,
					count: sql`count(${petsTable.species})`,
				})
				.from(petsTable)
				.where(eq(petsTable.ownerId, user.id))
				.groupBy(petsTable.species);

			return c.json({
				speciesCounts: speciesCounts,
				success: true,
			});
		} catch (e) {
			return c.json(
				{ success: false, error: "Failed to fetch all species" },
				500
			);
		}
	});
