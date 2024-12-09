export const PetSpecies = {
	DOG: "Dog",
	CAT: "Cat",
	BIRD: "Bird",
	RABBIT: "Rabbit",
	HAMSTER: "Hamster",
	GUINEA_PIG: "Guinea Pig",
	FERRET: "Ferret",
	GERBIL: "Gerbil",
	MOUSE: "Mouse",
	RAT: "Rat",
	HEDGEHOG: "Hedgehog",
	CHINCHILLA: "Chinchilla",
	SNAKE: "Snake",
	LIZARD: "Lizard",
	TURTLE: "Turtle",
	TORTOISE: "Tortoise",
	FISH: "Fish",
	BEARDED_DRAGON: "Bearded Dragon",
	GECKO: "Gecko",
	CHAMELEON: "Chameleon",
	IGUANA: "Iguana",
	PARROT: "Parrot",
	CANARY: "Canary",
	FINCH: "Finch",
	COCKATIEL: "Cockatiel",
	PARAKEET: "Parakeet",
	LOVEBIRD: "Lovebird",
	COCKATOO: "Cockatoo",
	MACAW: "Macaw",
	SUGAR_GLIDER: "Sugar Glider",
} as const;

type PetSpecies = (typeof PetSpecies)[keyof typeof PetSpecies];
