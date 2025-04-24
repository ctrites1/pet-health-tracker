import {
	pgTable,
	text,
	boolean,
	serial,
	integer,
	index,
} from "drizzle-orm/pg-core";
import { pets } from "./pets";

export const emergencyContacts = pgTable(
	"emergency_contacts",
	{
		id: serial().primaryKey(),
		name: text("name").notNull(),
		relationship: text("relationship").notNull(),
		phone: text("phone").notNull(),
		email: text("email").notNull(),
		isPrimary: boolean("is_primary").default(false).notNull(),
		petId: integer("pet_id")
			.notNull()
			.references(() => pets.id),
	},
	(emergency_contacts) => {
		return {
			idIndex: index("emerg_contact_id_index").on(emergency_contacts.id),
		};
	}
);
