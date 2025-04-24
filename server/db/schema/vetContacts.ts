import { pgTable, serial, text, index } from "drizzle-orm/pg-core";

export const vetContacts = pgTable(
	"vet_contacts",
	{
		id: serial().primaryKey(),
		name: text("name").notNull(),
		clinicName: text("clinic_name").notNull(),
		clinicAddress: text("clinic_address").notNull(),
		clinicPhone: text("clinic_phone").notNull(),
		clinicEmail: text("clinic_email"),
	},
	(vet_contacts) => {
		return {
			idIndex: index("vet_contact_id_index").on(vet_contacts.id),
		};
	}
);
