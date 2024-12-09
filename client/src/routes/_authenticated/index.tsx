import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import PetCard from "@/components/PetCard";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/")({
	component: Index,
});

async function getAllPets() {
	const res = await api.pets.$get();
	if (!res.ok) {
		throw new Error("Server Error");
	}
	const data = await res.json();

	return data.pets;
}

async function getSpeciesCount() {
	const res = await api.pets["all-species"].$get();
	if (!res.ok) {
		throw new Error("Server Error");
	}
	const data = await res.json();
	return data;
}

function Index() {
	const {
		data: speciesData,
		isPending: isSpeciesPending,
		error: speciesError,
	} = useQuery({
		queryKey: ["species-count"],
		queryFn: getSpeciesCount,
	});

	const {
		data: petsData,
		isPending: isPetsPending,
		error: petsError,
	} = useQuery({
		queryKey: ["pets"],
		queryFn: getAllPets,
	});

	if (speciesError || petsError) {
		return <div>Error: {speciesError?.message || petsError?.message}</div>;
	}

	if (isPetsPending || isSpeciesPending) {
		return <div>Loading...</div>;
	}

	const getCountForSpecies = (species: string) => {
		const result = speciesData?.speciesCounts.find(
			(s) => s.species === species
		);
		return result
			? `${result.count} ${result.count === 1 ? "pet" : "pets"}`
			: "0 pets";
	};

	return (
		<div className="flex flex-col min-h-screen bg-background">
			<main className="flex-1 p-8">
				<div className="mb-8">
					<h2 className="text-2xl font-bold mb-6">Pets</h2>
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{petsData.map((pet) => (
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
