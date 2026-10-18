import { type Submission } from '@acorn/reddit'
import { createContext, type ReactNode, useContext } from 'react'

import { useCreatePost } from '~/hooks/mutations/posts/create'

type SubmissionContext = ReturnType<typeof useCreatePost> & {
  submission: Submission
}

// @ts-expect-error
const SubmissionContext = createContext<SubmissionContext>({})

type Props = {
  children: ReactNode
  submission: Submission
}

export function SubmissionProvider({ children, submission }: Props) {
  const { form, createPost, isPending, types } = useCreatePost(submission)

  return (
    <SubmissionContext
      value={{
        createPost,
        form,
        isPending,
        submission,
        types,
      }}
    >
      {children}
    </SubmissionContext>
  )
}

export function useSubmission() {
  return useContext(SubmissionContext)
}
