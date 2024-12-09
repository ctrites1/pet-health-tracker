import {
	decimal,
	index,
	pgTable,
	serial,
	varchar,
	timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { z } from "zod";
import { PetSpecies } from "shared/types/petEnum";

export const pets = pgTable(
	"pets",
	{
		id: serial("id").primaryKey(),
		name: varchar("name").notNull(),
		species: varchar("species").notNull(),
		breed: varchar("breed"),
		dateOfBirth: timestamp("date_of_birth"),
		weight: decimal("weight", { precision: 5, scale: 2 }),
		imageUrl: varchar("image_url"),
		ownerId: varchar("owner_id").references(() => users.id),
	},
	(pets) => {
		return {
			idIndex: index("pet_id_index").on(pets.id),
		};
	}
);

export const basePetSchema = z.object({
	name: z
		.string()
		.min(2, { message: "Name must be at least 2 characters" })
		.max(100, { message: "Name must be at most 100 characters" }),
	species: z.enum(Object.values(PetSpecies) as [string, ...string[]]),
	breed: z.string().optional().nullable(),
	dateOfBirth: z.date().optional().nullable(),
	weight: z.number().positive().max(999).multipleOf(0.01).optional().nullable(),
	imageUrl: z.string().optional().nullable(),
});

export const createPetSchema = basePetSchema;

export const insertPetSchema = basePetSchema.extend({
	ownerId: z.string(),
});

export const petSchema = basePetSchema.extend({
	id: z.number().int().positive().min(1),
	ownerId: z.string(),
});

export type Pet = z.infer<typeof petSchema>;
