import { pgTable, text, timestamp, serial, integer } from "drizzle-orm/pg-core";
import { pets } from "./pets";
import { vetContacts } from "./vetContacts";

export const healthRecords = pgTable("health_records", {
	id: serial("id").primaryKey(),
	visitDate: timestamp("visit_date").notNull().defaultNow(),
	diagnosis: text("diagnosis").notNull(),
	treatment: text("treatment").notNull(),
	notes: text("notes"),
	petId: integer("pet_id")
		.notNull()
		.references(() => pets.id),
	vetId: integer("vet_id")
		.notNull()
		.references(() => vetContacts.id),
});
