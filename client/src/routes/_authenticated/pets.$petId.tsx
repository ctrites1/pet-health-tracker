import { createFileRoute } from '@tanstack/react-router';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { Pet } from '@/components/PetCard';
import { useForm } from '@tanstack/react-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Link } from '@tanstack/react-router';
import LoadingPulse from '@/components/LoadingPulse';

export const Route = createFileRoute('/_authenticated/pets/$petId')({
  component: PetPage,
});

function PetPage() {
  const { petId } = Route.useParams();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    data: pet,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['pet', petId],
    queryFn: async () => {
      const response = await fetch(`/api/pets/${petId}`);
      if (!response.ok) throw new Error('Failed to fetch pet');
      return response.json() as Promise<Pet>;
    },
  });

  const form = useForm<Pet>({
    defaultValues: pet ?? {
      id: 0,
      name: '',
      species: '',
      breed: '',
      dateOfBirth: '',
      weight: 0,
      ownerId: 0,
      imageUrl: '',
    },
    onSubmit: async ({ value }) => {
      updatePetMutation.mutate(value);
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`/api/pets/${petId}/image`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload image');
      return response.json();
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['pet', petId] });
    },
  });

  const updatePetMutation = useMutation({
    mutationFn: async (updatedPet: Pet) => {
      const response = await fetch(`/api/pets/${petId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPet),
      });
      if (!response.ok) throw new Error('Failed to update pet');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pet', petId] });
      setIsEditing(false);
    },
  });

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (isLoading) return <LoadingPulse />;

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">Error loading pet profile: {error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  if (!pet)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <div className="text-gray-400 text-6xl mb-4">🐾</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Pet Not Found</h2>
          <p className="text-gray-600 mb-4">
            The pet you're looking for doesn't exist or may have been removed.
          </p>
          <Link
            to="/pets"
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Back to Pets
          </Link>
        </div>
      </div>
    );

  const fields: Array<{
    name: keyof Pet;
    label: string;
    type: string;
  }> = [
    { name: 'name', label: 'Name', type: 'text' },
    { name: 'species', label: 'Species', type: 'text' },
    { name: 'breed', label: 'Breed', type: 'text' },
    { name: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
    { name: 'weight', label: 'Weight (kg)', type: 'number' },
  ];

  // * File Upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (selectedFile) {
      await uploadImageMutation.mutateAsync(selectedFile);
    }

    form.handleSubmit();
  };
  const deletePet = async () => {
    try {
      const response = await fetch(`/api/pets/${petId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete pet');
      }
      toast.success(`Successfully deleted ${pet.name}`);
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      window.location.href = '/';
    } catch (e) {
      toast.error('Failed to delete pet. Error: ');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="border-0 shadow-md bg-white/50 dark:bg-gray-800/80 dark:backdrop-blur-sm">
        <CardHeader className="flex flex-row justify-end gap-2 items-center">
          {isEditing ? (
            <>
              <Button type="submit" form="pet-form" variant="default">
                Save
              </Button>
              <Button
                type="button"
                variant="outline"
                className="!my-0"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button type="button" variant="default" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <form
            id="pet-form"
            onSubmit={e => {
              handleSubmit(e);
            }}
          >
            <div className="flex gap-6">
              <div className="w-48 space-y-4">
                <Avatar className="w-48 h-48">
                  <AvatarImage
                    src={previewUrl || pet.imageUrl}
                    alt={pet.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-4xl">
                    {pet.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {isEditing && (
                  <div className="space-y-2">
                    <Label htmlFor="image-upload">Profile Picture</Label>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full"
                    />
                  </div>
                )}
              </div>

              <div className="flex-1 grid grid-cols-2 gap-4">
                {fields.map(({ name, label, type }) => (
                  <form.Field
                    key={name}
                    name={name}
                    children={field => (
                      <div className="space-y-2">
                        <Label htmlFor={field.name} className="text-sm font-medium">
                          {label}
                        </Label>
                        {isEditing ? (
                          <Input
                            value={field.state.value}
                            onChange={e => field.handleChange(e.target.value)}
                            type={type}
                            className="w-full"
                          />
                        ) : (
                          <div className="py-2">
                            {type === 'number' ? `${pet[name]} kg` : pet[name].toString()}
                          </div>
                        )}
                      </div>
                    )}
                  />
                ))}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="flex flex-row items-center justify-between">
        <div className="mt-8 flex gap-4">
          <Button asChild variant="default">
            <Link to="/pets/$petId/caregivers" params={{ petId: petId }}>
              Caregivers
            </Link>
          </Button>

          <Button asChild variant="default">
            <Link to="/pets/$petId/health-records" params={{ petId: petId }}>
              Health Records
            </Link>
          </Button>
        </div>
        <div className="mt-8">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="bg-red-600 border-red-900 hover:bg-red-800">Delete Pet</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete {pet.name}?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete {pet.name}'s profile
                  and all associated records.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={deletePet} className="bg-red-600 hover:bg-red-700">
                  Delete Pet
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
