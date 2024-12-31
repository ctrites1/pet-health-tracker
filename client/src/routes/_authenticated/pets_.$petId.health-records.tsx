import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute(
	"/_authenticated/pets_/$petId/health-records"
)({
	component: HealthRecords,
});

interface VetInfo {
	name: string;
	clinic: string;
	address: string;
	email: string;
	phone: string;
}

interface HealthRecord {
	id: string;
	petName: string;
	visitDate: string;
	diagnosis: string;
	treatment: string;
	notes: string;
	vet: VetInfo;
}

function HealthRecords() {
	const { petId } = Route.useParams();

	const {
		data: records,
		isLoading,
		error,
	} = useQuery<HealthRecord[]>({
		queryKey: ["pet-health-records", petId],
		queryFn: async () => {
			const response = await fetch(`/api/pets/${petId}/health-records`);
			if (!response.ok) throw new Error("Failed to fetch health records");
			return response.json();
		},
	});

	if (isLoading) return <div>Loading...</div>;

	if (error) return <div>Error loading health records: {error.message}</div>;

	if (!records || records.length === 0) {
		return <p>No health records found for this pet</p>;
	}
	console.log("Pet: ", records[0].petName);

	return (
		<div>
			<h2>Health Records for {petName}</h2>

			<div>
				{records.map((record) => (
					<div key={record.id}>
						<h3>Visit Date: {record.visitDate}</h3>
						<div>
							<p>
								<strong>Diagnosis: {record.diagnosis}</strong>
							</p>
							<p>
								<strong>Treatment: {record.treatment}</strong>
							</p>
							<p>
								<strong>Notes: {record.notes}</strong>
							</p>

							<div>
								<h4>Vetrinarian Info</h4>
								<p>{record.vet.name}</p>
								<p>Clinic: {record.vet.clinic}</p>
								<p>Address: {record.vet.address}</p>
								<p>Phone: {record.vet.phone}</p>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
