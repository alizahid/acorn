import { useMemo } from 'react'

import { RenderHtmlSource } from '~/components/native/html'
import { type ContentWidthType, useContentWidth } from '~/hooks/content-width'
import { mergeHtmlMeta } from '~/lib/html'
import { type PostMediaMeta } from '~/types/post'

type Props = {
  children: string
  depth?: number
  meta?: PostMediaMeta
  type?: ContentWidthType
}

export function Html({ children, meta, type = 'full', depth }: Props) {
  const width = useContentWidth({
    depth,
    type,
  })

  const html = useMemo(() => mergeHtmlMeta(children, meta), [children, meta])

  return (
    <RenderHtmlSource
      contentWidth={width}
      source={{
        html,
      }}
    />
  )
}
