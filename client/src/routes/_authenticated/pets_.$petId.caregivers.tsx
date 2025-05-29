import { createFileRoute } from '@tanstack/react-router';
import { VetContact } from './pets_.$petId.health-records';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import LoadingPulse from '@/components/LoadingPulse';
import {
  FileText,
  Edit,
  TrashIcon,
  MapPin,
  Phone,
  Mail,
  PlusCircle,
  Stethoscope,
  UserCheck,
} from 'lucide-react';

export const Route = createFileRoute('/_authenticated/pets_/$petId/caregivers')({
  component: Caregivers,
});

interface VetContactWithId extends VetContact {
  id: string;
}

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  isPrimary: boolean;
}

interface Response {
  name: string;
  vets: VetContactWithId[];
  emergencyContacts: EmergencyContact[];
}

function Caregivers() {
  const { petId } = Route.useParams();
  const { data, isLoading, error } = useQuery<Response>({
    queryKey: ['caregivers', petId],
    queryFn: async () => {
      const response = await fetch(`/api/pets/${petId}/caregivers`);
      if (!response.ok) throw new Error('Failed to fetch caregiver information');
      return response.json();
    },
  });

  if (isLoading) return <LoadingPulse />;
  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-destructive">Error loading caregivers: {error.message}</div>
      </div>
    );

  if (!data?.name) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-muted-foreground">Pet not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{data.name}'s Caregivers</h1>
      </div>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Veterinarians</h2>
        </div>
        {data.vets && data.vets.length > 0 ? (
          <div className="space-y-4">
            {data.vets.map(vet => (
              <Card
                key={vet.id}
                className="shadow-sm border-dashed bg-white/50 dark:bg-gray-800/80 dark:backdrop-blur-sm"
              >
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{vet.name}</h3>
                      <p className="text-sm text-muted-foreground">{vet.clinic}</p>
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
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{vet.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{vet.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>{vet.email}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="shadow-sm border-dashed bg-white/50 dark:bg-gray-800/80 dark:backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-muted p-4 rounded-full mb-4">
                <Stethoscope className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">No Veterinarians Added</h3>
              <p className="text-muted-foreground mb-4 max-w-sm">
                Add your pet's veterinary information to keep track of their healthcare providers.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Emergency Contacts</h2>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Emergency Contact
          </Button>
        </div>

        {data.emergencyContacts && data.emergencyContacts.length > 0 ? (
          <div className="space-y-4">
            {data.emergencyContacts.map(contact => (
              <Card
                key={contact.id}
                className="shadow-sm border-dashed bg-white/50 dark:bg-gray-800/80 dark:backdrop-blur-sm"
              >
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {contact.name}
                        {contact.isPrimary && (
                          <span className="ml-2 text-sm text-primary">(Primary)</span>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground">{contact.relationship}</p>
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
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{contact.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>{contact.email}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="shadow-sm border-dashed bg-white/50 dark:bg-gray-800/80 dark:backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-muted p-4 rounded-full mb-4">
                <UserCheck className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">No Emergency Contacts Added</h3>
              <p className="text-muted-foreground mb-4 max-w-sm">
                Add emergency contacts who can help care for your pet when you're unavailable.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
