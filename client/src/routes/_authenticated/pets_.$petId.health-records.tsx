import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/pets_/$petId/health-records',
)({
  component: HealthRecords,
})

function HealthRecords() {
  const { petId } = Route.useParams()
  console.log('Health Records page')

  return (
    <div>
      Pet {petId}
      <p>please work for the love of god</p>
    </div>
  )
}
