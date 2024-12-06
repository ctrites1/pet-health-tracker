import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/pets/$petId/health-records")({
	component: HealthRecords,
});

function HealthRecords() {
	const { petId } = Route.useParams();
	return <div>Pet {petId}</div>;
}
