import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

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
});

const createPetSchema = petSchema.omit({ id: true });

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
	},
	{
		id: 2,
		name: "Thumper",
		species: "Rabbit",
		breed: "Holland Lop",
		dateOfBirth: new Date("2019-04-12"),
		weight: 2.5,
		ownerId: 2,
	},
	{
		id: 3,
		name: "Joni",
		species: "Rabbit",
		breed: "Dutch",
		dateOfBirth: new Date("2021-07-21"),
		weight: 1.8,
		ownerId: 3,
	},
];

export const petsRoute = new Hono()
	.get("/", (c) => {
		return c.json({ pets: fakePets });
	})
	.post("/", zValidator("json", createPetSchema), async (c) => {
		const data = await c.req.valid("json");
		const pet = createPetSchema.parse(data);
		c.status(201);

		fakePets.push({ ...pet, id: fakePets.length + 1 });

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
	});
