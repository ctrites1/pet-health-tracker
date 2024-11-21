import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { useEffect, useState } from "react";

interface SpeciesCount {
	species: string;
	count: number;
}

export default function App() {
	const [speciesCounts, setSpeciesCounts] = useState<SpeciesCount[]>([]);

	useEffect(() => {
		async function fetchSpeciesCounts() {
			const res = await fetch("/api/pets/all-species");
			const data = await res.json();
			setSpeciesCounts(data.speciesCounts);
		}
		fetchSpeciesCounts();
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
				</div>
				<h2 className="text-2xl font-bold mb-6">Pets</h2>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					<Card>
						<CardHeader>
							<CardTitle>Max</CardTitle>
						</CardHeader>
						<CardContent className="flex items-center space-x-4">
							<Avatar className="h-20 w-20">
								<AvatarImage src="/pets/max.jpg" />
								<AvatarFallback>MX</AvatarFallback>
							</Avatar>
							<div>
								<p>Breed: Labrador Retriever</p>
								<p>Birthday: December 25, 2011</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	);
}
