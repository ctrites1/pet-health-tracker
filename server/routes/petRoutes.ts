import { Hono } from "hono";

type Pet = {
	id: string; // Unique identifier
	name: string;
	species: string;
	breed?: string;
	dateOfBirth: Date;
	weight: number; // Current weight in preferred unit
	ownerId: string; // Reference to the authenticated owner

	/* // Health-specific fields
	medications: {
		name: string;
		dosage: string;
		frequency: string;
		startDate: Date;
		endDate?: Date;
		notes?: string;
	}[];

	allergies: string[]; // Known allergies

	medicalConditions: {
		condition: string;
		diagnosedDate: Date;
		notes?: string;
	}[];

	vaccinations: {
		name: string;
		dateAdministered: Date;
		nextDueDate: Date;
		administrator?: string; // Vet or clinic name
	}[];

	dietaryRestrictions?: string[];

	// Emergency contact info
	veterinarian: {
		name: string;
		phone: string;
		clinic?: string;
	};

	// Additional optional fields
	image?: string; // URL or path to pet's photo
	notes?: string; // General notes about the pet
	lastCheckup?: Date; // Date of last vet visit */
};

// const fakePets = ;

export const petsRoute = new Hono()
	.get("/", (c) => {
		return c.json({ pets: [] });
	})
	.post("/", (c) => {
		return c.json({});
	});
