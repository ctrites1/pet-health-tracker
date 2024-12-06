CREATE TABLE IF NOT EXISTS "emergency_contacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"relationship" text NOT NULL,
	"phone" text NOT NULL,
	"email" text NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"pet_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "health_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"visit_date" timestamp DEFAULT now() NOT NULL,
	"diagnosis" text NOT NULL,
	"treatment" text NOT NULL,
	"notes" text,
	"pet_id" integer NOT NULL,
	"vet_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pets" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"species" varchar NOT NULL,
	"breed" varchar,
	"date_of_birth" date,
	"weight" numeric(5, 2),
	"image_url" varchar,
	"owner_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vet_contacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"clinic_name" text NOT NULL,
	"clinic_address" text NOT NULL,
	"clinic_phone" text NOT NULL,
	"clinic_email" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "emergency_contacts" ADD CONSTRAINT "emergency_contacts_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "health_records" ADD CONSTRAINT "health_records_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "health_records" ADD CONSTRAINT "health_records_vet_id_vet_contacts_id_fk" FOREIGN KEY ("vet_id") REFERENCES "public"."vet_contacts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pets" ADD CONSTRAINT "pets_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "emerg_contact_id_index" ON "emergency_contacts" USING btree ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pet_id_index" ON "pets" USING btree ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_index" ON "users" USING btree ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "vet_contact_id_index" ON "vet_contacts" USING btree ("id");