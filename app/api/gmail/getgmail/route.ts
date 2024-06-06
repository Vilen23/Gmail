// Change the path to where your `authOptions` is
import { NEXT_AUTH } from '@/lib/auth'

import { getServerSession } from 'next-auth'

export async function POST() {
  const session = await getServerSession(NEXT_AUTH)
  if (!session) {
    return Response.json({ message: 'You must be logged in.' }, { status: 401 })
  }

  try {
    // const result = someOperations() // ...
    const result = { message: 'You must be logged in.' }
    return Response.json(result)
  } catch (err) {
    return Response.json(err, { status: 500 })
  }
}