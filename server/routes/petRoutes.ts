import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { db } from "../db";
import { pets as petsTable, insertPetSchema } from "server/db/schema/pets";
import { eq, sql } from "drizzle-orm";
import { getUser } from "server/kinde";
import { createPetSchema } from "server/sharedTypes";
import { healthRecords as healthRecordsTable } from "server/db/schema/healthRecords";
import { vetContacts as vetContactsTable } from "server/db/schema/vetContacts";
import { emergencyContacts as emergencyContactsTable } from "server/db/schema/emergencyContacts";

export const petsRoute = new Hono()
	.get("/", getUser, async (c) => {
		try {
			const user = c.var.user;
			const pets = await db
				.select()
				.from(petsTable)
				.where(eq(petsTable.ownerId, user.id));
			console.log("pets: ", pets);

			return c.json({ pets: pets, success: true });
		} catch (e) {
			console.log("Fetching pets error: ", e);
			return c.json({ success: false, error: "Failed to fetch pets" }, 500);
		}
	})
	.post("/", getUser, zValidator("json", createPetSchema), async (c) => {
		const newPet = await c.req.valid("json");
		const user = c.var.user;

		const validatedPet = insertPetSchema.parse({
			...newPet,
			dateOfBirth: newPet.dateOfBirth?.toString(),
			weight: newPet.weight,
			ownerId: user.id,
		});

		const result = await db
			.insert(petsTable)
			.values({
				...validatedPet,
				weight: validatedPet.weight?.toString(),
			})
			.returning();

		c.status(201);
		return c.json(result);
	})
	.get("/:id{[0-9]+}", getUser, async (c) => {
		const paramId = Number.parseInt(c.req.param("id"));

		const result = await db
			.select()
			.from(petsTable)
			.where(eq(petsTable.id, paramId));
		const { id, name, species, breed, dateOfBirth, weight, ownerId, imageUrl } =
			result[0];

		return c.json({
			id: id,
			name: name,
			species: species,
			breed: breed,
			dateOfBirth: dateOfBirth,
			weight: weight,
			ownerId: ownerId,
			imageUrl: imageUrl,
		});
	})
	.delete("/:id{[0-9]+}", getUser, async (c) => {
		const paramId = Number.parseInt(c.req.param("id"));

		const petToDelete = await db
			.select()
			.from(petsTable)
			.where(eq(petsTable.id, paramId));

		await db.delete(petsTable).where(eq(petsTable.id, paramId));

		return c.json({ deletedPet: petToDelete });
	})
	.get("/all-species", getUser, async (c) => {
		try {
			const user = c.var.user;

			const speciesCounts = await db
				.select({
					species: petsTable.species,
					count: sql`count(${petsTable.species})`,
				})
				.from(petsTable)
				.where(eq(petsTable.ownerId, user.id))
				.groupBy(petsTable.species);

			return c.json({
				speciesCounts: speciesCounts,
				success: true,
			});
		} catch (e) {
			return c.json(
				{ success: false, error: "Failed to fetch all species" },
				500
			);
		}
	})
	.get("/:id{[0-9]+}/health-records", getUser, async (c) => {
		const paramId = Number.parseInt(c.req.param("id"));

		const nameResult = await db
			.select({
				name: petsTable.name,
			})
			.from(petsTable)
			.where(eq(petsTable.id, paramId));

		const recordsResults = await db
			.select({
				id: healthRecordsTable.id,
				visitDate: healthRecordsTable.visitDate,
				diagnosis: healthRecordsTable.diagnosis,
				treatment: healthRecordsTable.treatment,
				notes: healthRecordsTable.notes,
				vet: {
					name: vetContactsTable.name,
					clinic: vetContactsTable.clinicName,
					address: vetContactsTable.clinicAddress,
					email: vetContactsTable.clinicEmail,
					phone: vetContactsTable.clinicPhone,
				},
			})
			.from(healthRecordsTable)
			.where(eq(healthRecordsTable.petId, paramId))
			.leftJoin(
				vetContactsTable,
				eq(healthRecordsTable.vetId, vetContactsTable.id)
			);

		return c.json({
			name: nameResult[0].name,
			records: recordsResults,
		});
	})
	.get("/:id{[0-9]+}/health-records", getUser, async (c) => {
		const paramId = Number.parseInt(c.req.param("id"));

		const nameResult = await db
			.select({
				name: petsTable.name,
			})
			.from(petsTable)
			.where(eq(petsTable.id, paramId));

		const recordsResults = await db
			.select({
				id: healthRecordsTable.id,
				visitDate: healthRecordsTable.visitDate,
				diagnosis: healthRecordsTable.diagnosis,
				treatment: healthRecordsTable.treatment,
				notes: healthRecordsTable.notes,
				vet: {
					name: vetContactsTable.name,
					clinic: vetContactsTable.clinicName,
					address: vetContactsTable.clinicAddress,
					email: vetContactsTable.clinicEmail,
					phone: vetContactsTable.clinicPhone,
				},
			})
			.from(healthRecordsTable)
			.where(eq(healthRecordsTable.petId, paramId))
			.leftJoin(
				vetContactsTable,
				eq(healthRecordsTable.vetId, vetContactsTable.id)
			);

		return c.json({
			name: nameResult[0].name,
			records: recordsResults,
		});
	})
	.get("/:id{[0-9]+}/caregivers", getUser, async (c) => {
		const paramId = Number.parseInt(c.req.param("id"));

		const nameResult = await db
			.select({
				name: petsTable.name,
			})
			.from(petsTable)
			.where(eq(petsTable.id, paramId));

		const vetResults = await db
			.select({
				id: vetContactsTable.id,
				name: vetContactsTable.name,
				clinic: vetContactsTable.clinicName,
				address: vetContactsTable.clinicAddress,
				email: vetContactsTable.clinicEmail,
				phone: vetContactsTable.clinicPhone,
			})
			.from(vetContactsTable)
			.where(eq(healthRecordsTable.petId, paramId))
			.leftJoin(
				healthRecordsTable,
				eq(vetContactsTable.id, healthRecordsTable.vetId)
			);
		const emergContactResults = await db
			.select({
				id: emergencyContactsTable.id,
				name: emergencyContactsTable.name,
				relationship: emergencyContactsTable.relationship,
				phone: emergencyContactsTable.phone,
				email: emergencyContactsTable.email,
				isPrimary: emergencyContactsTable.isPrimary,
			})
			.from(emergencyContactsTable)
			.where(eq(emergencyContactsTable.petId, paramId));

		return c.json({
			name: nameResult[0].name,
			vets: vetResults,
			emergencyContacts: emergContactResults,
		});
	});
