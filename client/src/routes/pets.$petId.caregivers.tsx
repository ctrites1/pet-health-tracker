import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/pets/$petId/caregivers")({
	component: Caregivers,
});

function Caregivers() {
	const { petId } = Route.useParams();
	return <div>Pet {petId}</div>;
}
