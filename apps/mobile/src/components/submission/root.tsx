import { type Submission } from '@acorn/reddit'
import { type ReactNode } from 'react'

import { SubmissionProvider } from './provider'

type Props = {
  children: ReactNode
  submission: Submission
}

export function SubmissionRoot({ children, submission }: Props) {
  return (
    <SubmissionProvider submission={submission}>{children}</SubmissionProvider>
  )
}
