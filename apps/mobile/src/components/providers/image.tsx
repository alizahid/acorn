import { type ReactNode, useEffect } from 'react'

import { Gallery } from '@/gallery'
import { useCopyImage, useDownloadImage, useShareImage } from '~/hooks/image'

type Props = {
  children: ReactNode
}

export function ImageProvider({ children }: Props) {
  const { share } = useShareImage()
  const { copy } = useCopyImage()
  const { download } = useDownloadImage()

  useEffect(() => {
    const subscription = Gallery.addListener('onAction', ({ id, url }) => {
      if (id === 'share') {
        share({
          url,
        })
      }

      if (id === 'copy') {
        copy({
          url,
        })
      }

      if (id === 'download') {
        download({
          url,
        })
      }
    })

    return () => {
      subscription.remove()
    }
  }, [copy, download, share])

  return children
}
