import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Link } from "@tanstack/react-router";

export interface Pet {
	id: number;
	name: string;
	species: string;
	breed: string;
	dateOfBirth: string;
	weight: number;
	ownerId: number;
	imageUrl: string;
}
export default function PetCard({ pet }: { pet: Pet }) {
	const calculateAge = (birthDate: string) => {
		const years = Math.floor(
			(new Date().getTime() - new Date(birthDate).getTime()) / 31536000000
		);
		return `${years} ${years === 1 ? "year" : "years"}`;
	};

	return (
		<Link to="/pets/$petId" params={{ petId: pet.id }}>
			<Card>
				<CardContent className="pt-4">
					<div className="flex flex-col items-center">
						<Avatar className="h-32 w-32 mb-4 text-center place-content-center bg-gray-100 rounded-full">
							<AvatarImage src={pet.imageUrl} />
							<AvatarFallback>
								{pet.name.substring(0, 2).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<h3 className="text-xl font-semibold mb-2">{pet.name}</h3>
						<div className="text-sm text-muted-foreground space-y-1 text-center">
							<p>Species: {pet.species}</p>
							<p>Age: {calculateAge(pet.dateOfBirth)}</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}
