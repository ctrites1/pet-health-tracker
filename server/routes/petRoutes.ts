import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

import { db } from "../db";
import { pets as petsTable } from "server/db/schema/pets";

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
		const pets = await db.select().from(petsTable);
		console.log("pets: ", pets);

		return c.json({ pets: pets });
	})
	.post("/", zValidator("json", createPetSchema), async (c) => {
		const data = await c.req.valid("json");
		const pet = createPetSchema.parse(data);
		c.status(201);

		fakePets.push({ ...pet, id: fakePets.length + 1, imageUrl: "" });

		return c.json(pet);
	})
	.get("/:id{[0-9]+}", (c) => {
		const id = Number.parseInt(c.req.param("id"));

		const pet = fakePets.find((pet) => pet.id === id);
		if (!pet) {
			return c.notFound();
		}
		return c.json({ pet });
	})
	.delete("/:id{[0-9]+}", (c) => {
		const id = Number.parseInt(c.req.param("id"));

		const index = fakePets.findIndex((pet) => pet.id === id);
		if (index === -1) {
			return c.notFound();
		}
		const deletedPet = fakePets.splice(index, 1)[0];
		return c.json({ pet: deletedPet });
	})
	.get("/all-species", (c) => {
		const counts = fakePets.reduce((acc, pet) => {
			acc[pet.species] = (acc[pet.species] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		const speciesCounts = Object.entries(counts).map(([species, count]) => ({
			species,
			count,
		}));

		return c.json({
			speciesCounts: speciesCounts,
		});
	});
