import {
	date,
	decimal,
	index,
	integer,
	pgTable,
	serial,
	varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const pets = pgTable(
	"pets",
	{
		id: serial("id").primaryKey(),
		name: varchar("name").notNull(),
		species: varchar("species").notNull(),
		breed: varchar("breed"),
		dateOfBirth: date("date_of_birth"),
		weight: decimal("weight", { precision: 5, scale: 2 }),
		imageUrl: varchar("image_url"),
		ownerId: integer("owner_id").references(() => users.id),
	},
	(pets) => {
		return {
			idIndex: index("pet_id_index").on(pets.id),
		};
	}
);
