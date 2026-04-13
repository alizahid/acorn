import { useMemo } from 'react'

import { mergeMetaMarkdown } from '~/lib/markdown'
import { type PostMediaMeta } from '~/types/post'

import { EnrichedMarkdown } from '../native/markdown'

type Props = {
  children: string
  meta?: PostMediaMeta
}

export function Markdown({ children, meta }: Props) {
  const markdown = useMemo(
    () => mergeMetaMarkdown(children, meta),
    [children, meta],
  )

  return (
    <EnrichedMarkdown
      flavor="github"
      markdown={markdown}
      spoilerOverlay="solid"
    />
  )
}
