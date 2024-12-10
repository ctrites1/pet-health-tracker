import { pgTable, varchar, text, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const users = pgTable(
	"users",
	{
		id: varchar("id").primaryKey(),
		name: text("name").notNull(),
		email: text("email").notNull().unique(),
	},
	(table) => {
		return {
			idIndex: index("user_id_index").on(table.id),
		};
	}
);

export const userInsertSchema = createInsertSchema(users);
