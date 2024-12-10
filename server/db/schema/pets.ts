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
		.min(2, { message: "Name must be at least 2 characters long" })
		.max(100, { message: "Name must be at most 100 characters long" }),
	species: z.enum(Object.values(PetSpecies) as [string, ...string[]], {
		message: "Species must be one of the predefined values",
	}),
	breed: z
		.string()
		.optional()
		.nullable()
		.refine((val) => val === null || val === undefined || val.length <= 100, {
			message: "Breed must be at most 100 characters long",
		}),
	dateOfBirth: z
		.string()
		.transform((str) => (str ? new Date(str) : null))
		.pipe(
			z
				.date()
				.max(new Date(), { message: "Date of birth cannot be in the future" })
				.min(new Date(Date.now() - 100 * 365 * 24 * 60 * 60 * 1000), {
					message: "Date of birth cannot be more than 100 years ago",
				})
				.optional()
				.nullable()
		),
	weight: z
		.number()
		.positive({ message: "Weight must be a positive number" })
		.max(999, { message: "Weight must be less than 999" })
		.multipleOf(0.01, { message: "Weight must be a multiple of 0.01" })
		.optional()
		.nullable(),
	imageUrl: z
		.string()
		.url({ message: "Must be a valid URL" })
		.optional()
		.nullable(),
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
