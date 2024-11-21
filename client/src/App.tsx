import { Card, CardContent } from "./components/ui/card";
import { useEffect, useState } from "react";
import PetCard from "./components/PetCard";
import type { Pet } from "./components/PetCard";
import { api } from "./lib/api";

interface SpeciesCount {
	species: string;
	count: number;
}

export default function App() {
	const [speciesCounts, setSpeciesCounts] = useState<SpeciesCount[]>([]);
	const [allPets, setAllPets] = useState<Pet[]>([]);

	useEffect(() => {
		async function fetchSpeciesCounts() {
			const res = await api.pets["all-species"].$get();
			const data = await res.json();
			setSpeciesCounts(data.speciesCounts);
		}

		async function fetchAllPets() {
			const res = await api.pets.$get();
			const data = await res.json();
			setAllPets(data.pets);
		}

		fetchSpeciesCounts();
		fetchAllPets();
	}, []);

	const getCountForSpecies = (species: string) => {
		const speciesData = speciesCounts.find((s) => s.species === species);
		return speciesData
			? `${speciesData.count} ${speciesData.count === 1 ? "pet" : "pets"}`
			: "0 pets";
	};

	return (
		<div className="flex flex-col min-h-screen">
			<header className="p-4 border-b">
				<div className="flex items-center space-x-3">
					<img
						src="/petfolio-logo.svg"
						alt="Petfolio Logo"
						className="w-8 h-8"
					/>
					<h2 className="text-2xl font-bold">Petfolio</h2>
				</div>
			</header>

			<main className="flex-1 p-8">
				<div className="mb-8">
					<h2 className="text-2xl font-bold mb-6">Pets</h2>
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{allPets.map((pet) => (
							<PetCard key={pet.id} pet={pet} />
						))}
					</div>
				</div>

				<h2 className="text-2xl font-bold mb-4">Pet Types</h2>
				<div className="flex gap-4">
					{getCountForSpecies("Dog") && (
						<Card className="w-[200px]">
							<CardContent className="pt-6">
								<div className="text-center">
									<div className="text-4xl mb-2">🐕</div>
									<h3 className="text-lg font-semibold">Dogs</h3>
									<p className="text-sm text-muted-foreground">
										{getCountForSpecies("Dog")}
									</p>
								</div>
							</CardContent>
						</Card>
					)}
					{getCountForSpecies("Cat") && (
						<Card className="w-[200px]">
							<CardContent className="pt-6">
								<div className="text-center">
									<div className="text-4xl mb-2">🐈</div>
									<h3 className="text-lg font-semibold">Cats</h3>
									<p className="text-sm text-muted-foreground">
										{getCountForSpecies("Cat")}
									</p>
								</div>
							</CardContent>
						</Card>
					)}
					{getCountForSpecies("Rabbit") && (
						<Card className="w-[200px]">
							<CardContent className="pt-6">
								<div className="text-center">
									<div className="text-4xl mb-2">🐇</div>
									<h3 className="text-lg font-semibold">Rabbits</h3>
									<p className="text-sm text-muted-foreground">
										{getCountForSpecies("Rabbit")}
									</p>
								</div>
							</CardContent>
						</Card>
					)}
				</div>
			</main>
		</div>
	);
}
