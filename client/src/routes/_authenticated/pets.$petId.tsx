import { createFileRoute } from '@tanstack/react-router'
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { Pet } from '@/components/PetCard'
import { useForm } from '@tanstack/react-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export const Route = createFileRoute('/_authenticated/pets/$petId')({
  component: PetPage,
})

function PetPage() {
  const { petId } = Route.useParams()
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const {
    data: pet,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['pet', petId],
    queryFn: async () => {
      const response = await fetch(`/api/pets/${petId}`)
      if (!response.ok) throw new Error('Failed to fetch pet')
      return response.json() as Promise<Pet>
    },
  })

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
      updatePetMutation.mutate(value)
    },
  })

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch(`/api/pets/${petId}/image`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Failed to upload image')
      return response.json()
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['pet', petId] })
    },
  })

  const updatePetMutation = useMutation({
    mutationFn: async (updatedPet: Pet) => {
      const response = await fetch(`/api/pets/${petId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPet),
      })
      if (!response.ok) throw new Error('Failed to update pet')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pet', petId] })
      setIsEditing(false)
    },
  })

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading pet profile: {error.message}</div>
  if (!pet) return <div>Pet not found</div>

  const fields: Array<{
    name: keyof Pet
    label: string
    type: string
  }> = [
    { name: 'name', label: 'Name', type: 'text' },
    { name: 'species', label: 'Species', type: 'text' },
    { name: 'breed', label: 'Breed', type: 'text' },
    { name: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
    { name: 'weight', label: 'Weight (kg)', type: 'number' },
  ]

  // * File Upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (selectedFile) {
      await uploadImageMutation.mutateAsync(selectedFile)
    }

    form.handleSubmit()
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
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
            <Button
              type="button"
              variant="default"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <form
            id="pet-form"
            onSubmit={(e) => {
              handleSubmit(e)
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
                    children={(field) => (
                      <div className="space-y-2">
                        <Label
                          htmlFor={field.name}
                          className="text-sm font-medium"
                        >
                          {label}
                        </Label>
                        {isEditing ? (
                          <Input
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            type={type}
                            className="w-full"
                          />
                        ) : (
                          <div className="py-2">
                            {type === 'number'
                              ? `${pet[name]} kg`
                              : pet[name].toString()}
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

      <div className="mt-8 flex gap-4">
        <Button asChild variant="default">
          <a href={`/pets/${petId}/caregivers`}>Manage Caregivers</a>
        </Button>
        <Button asChild variant="default">
          <a href={`/pets/${petId}/health-records`}>Health Records</a>
        </Button>
      </div>
    </div>
  )
}
