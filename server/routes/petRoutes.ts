import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

import { db } from "../db";
import { pets as petsTable } from "server/db/schema/pets";
import { eq, sql } from "drizzle-orm";

const petSchema = z.object({
	id: z.number().int().positive().min(1),
	name: z.string(),
	species: z.string(),
	breed: z.string(),
	dateOfBirth: z.coerce
		.date()
		.max(new Date(), "Date of birth cannot be in the future"),
	weight: z.number(),
	ownerId: z.number().int().positive().min(1),
	imageUrl: z.string(),
});

const createPetSchema = petSchema.omit({ id: true, imageUrl: true });

type Pet = z.infer<typeof petSchema>;

const fakePets: Pet[] = [
	{
		id: 1,
		name: "Chungus",
		species: "Cat",
		breed: "Siamese",
		dateOfBirth: new Date("2018-06-15"),
		weight: 4.5,
		ownerId: 1,
		imageUrl: "",
	},
	{
		id: 2,
		name: "Thumper",
		species: "Rabbit",
		breed: "Holland Lop",
		dateOfBirth: new Date("2019-04-12"),
		weight: 2.5,
		ownerId: 2,
		imageUrl: "",
	},
	{
		id: 3,
		name: "Joni",
		species: "Rabbit",
		breed: "Dutch",
		dateOfBirth: new Date("2021-07-21"),
		weight: 1.8,
		ownerId: 3,
		imageUrl: "",
	},
];

export const petsRoute = new Hono()
	.get("/", async (c) => {
		const pets = await db.select().from(petsTable); // returns array
		console.log("pets: ", pets);

		return c.json({ pets: pets });
	})
	// TODO: use db data
	.post("/", zValidator("json", createPetSchema), async (c) => {
		const data = await c.req.valid("json");
		const pet = createPetSchema.parse(data);
		c.status(201);

		return c.json(pet);
	})
	.get("/:id{[0-9]+}", async (c) => {
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
	.delete("/:id{[0-9]+}", async (c) => {
		const paramId = Number.parseInt(c.req.param("id"));

		const petToDelete = await db
			.select()
			.from(petsTable)
			.where(eq(petsTable.id, paramId));

		await db.delete(petsTable).where(eq(petsTable.id, paramId));

		return c.json({ deletedPet: petToDelete });
	})
	.get("/all-species", async (c) => {
		const speciesCounts = await db
			.select({
				species: petsTable.species,
				count: sql`count(${petsTable.species})`,
			})
			.from(petsTable)
			.groupBy(petsTable.species);

		return c.json({
			speciesCounts: speciesCounts,
		});
	});
