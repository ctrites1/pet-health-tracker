import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
	PlusCircle,
	FileText,
	Edit,
	TrashIcon,
	MapPin,
	Phone,
	Mail,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { format } from "date-fns";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute(
	"/_authenticated/pets_/$petId/health-records"
)({
	component: HealthRecords,
});

export interface VetContact {
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
	vet: VetContact;
}

interface Response {
	name: string;
	records: HealthRecord[];
}

function HealthRecords() {
	const { petId } = Route.useParams();

	const { data, isLoading, error } = useQuery<Response>({
		queryKey: ["pet-health-records", petId],
		queryFn: async () => {
			const response = await fetch(`/api/pets/${petId}/health-records`);
			if (!response.ok) throw new Error("Failed to fetch health records");
			return response.json();
		},
	});

	if (isLoading)
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="text-muted-foreground">Loading...</div>
			</div>
		);

	if (error)
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="text-destructive">
					Error loading health records: {error.message}
				</div>
			</div>
		);

	if (!data?.name) {
		return (
			<div className="flex flex-col items-center justify-center h-screen gap-4">
				<p className="text-muted-foreground">Pet not found</p>
			</div>
		);
	}

	if (!data.records || data.records.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center h-screen gap-4">
				<p className="text-muted-foreground">
					No health records found for this pet
				</p>
				<Button>
					<PlusCircle className="mr-2 h-4 w-4" />
					Add First Record
				</Button>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">{data.name}'s Health Records</h1>
				<Button>
					<PlusCircle className="mr-2 h-4 w-4" />
					Add Record
				</Button>
			</div>
			<div className="space-y-4">
				{data.records.map((record) => (
					<Card key={record.id} className="shadow-sm">
						<CardHeader className="flex flex-row items-center justify-between">
							<div className="flex items-center gap-4">
								<div className="bg-primary/10 p-2 rounded-full">
									<FileText className="h-4 w-4 text-primary" />
								</div>
								<div>
									<h3 className="font-semibold">
										Visit on{" "}
										{format(new Date(record.visitDate), "MMM dd, yyyy")}
									</h3>
									<p className="text-sm text-muted-foreground">
										{record.vet.clinic}
									</p>
								</div>
							</div>
							<div className="flex gap-2">
								<Button variant="outline" size="sm">
									<Edit className="h-4 w-4 mr-1" />
									Edit
								</Button>
								<Button variant="ghost" size="sm" className="text-destructive">
									<TrashIcon className="h-4 w-4" />
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							<Accordion type="single" collapsible>
								<AccordionItem value="details">
									<AccordionTrigger>Visit Details</AccordionTrigger>
									<AccordionContent>
										<div className="space-y-4">
											<div>
												<h4 className="font-medium mb-2">Diagnosis</h4>
												<p className="text-sm text-muted-foreground">
													{record.diagnosis}
												</p>
											</div>
											<div>
												<h4 className="font-medium mb-2">Treatment</h4>
												<p className="text-sm text-muted-foreground">
													{record.treatment}
												</p>
											</div>
											<div>
												<h4 className="font-medium mb-2">Notes</h4>
												<p className="text-sm text-muted-foreground">
													{record.notes}
												</p>
											</div>
										</div>
									</AccordionContent>
								</AccordionItem>
								<AccordionItem value="vet">
									<AccordionTrigger>Veterinarian Information</AccordionTrigger>
									<AccordionContent>
										<div className="space-y-2">
											<p className="font-medium">{record.vet.name}</p>
											<div className="text-sm text-muted-foreground space-y-1">
												<div className="flex items-center gap-2">
													<MapPin className="h-4 w-4" />
													<span>{record.vet.address}</span>
												</div>
												<div className="flex items-center gap-2">
													<Phone className="h-4 w-4" />
													<span>{record.vet.phone}</span>
												</div>
												<div className="flex items-center gap-2">
													<Mail className="h-4 w-4" />
													<span>{record.vet.email}</span>
												</div>
											</div>
										</div>
									</AccordionContent>
								</AccordionItem>
							</Accordion>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
