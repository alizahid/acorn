import { z } from 'zod'

import { Auth as AuthAppStore } from '~/components/screens/auth/app-store'
import { Auth as AuthTestFlight } from '~/components/screens/auth/test-flight'
import { testFlight } from '~/lib/common'

const schema = z.object({
  mode: z.enum(['dismissible', 'fixed']).catch('fixed'),
})

export type SignInParams = z.infer<typeof schema>

export default function Screen() {
  if (testFlight) {
    return <AuthTestFlight />
  }

  return <AuthAppStore />
}
