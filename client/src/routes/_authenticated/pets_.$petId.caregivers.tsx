import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/pets_/$petId/caregivers')(
  {
    component: Caregivers,
  },
)

function Caregivers() {
  const { petId } = Route.useParams()
  console.log('Caregivers page')
  return <div>Pet {petId}</div>
}
