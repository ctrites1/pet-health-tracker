import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/pets/$petId")({
	component: PetPage,
});

// TODO: Add caregivers link
// TODO: Add health-records link

function PetPage() {
	const { petId } = Route.useParams();
	return <div>Pet {petId}</div>;
}
