import { createFileRoute } from '@tanstack/react-router'
import { userQueryOptions } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/_authenticated/profile')({
  component: Profile,
})

function Profile() {
  const { isPending, error, data } = useQuery(userQueryOptions)

  if (isPending) return 'loading'
  if (error) return 'not logged in'
  return (
    <div>
      Hello from Profile!
      <p> Hello {data.user.family_name} </p>
    </div>
  )
}
