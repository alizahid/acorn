import { Link } from 'expo-router'
import { type ReactNode } from 'react'
import { useTranslations } from 'use-intl'

import { useCopyImage, useDownloadImage, useShareImage } from '~/hooks/image'

type Props = {
  children: ReactNode
  url: string
}

export function ImageMenu({ children, url }: Props) {
  const t = useTranslations('component.posts.link')

  const { download } = useDownloadImage()
  const { copy } = useCopyImage()
  const { share } = useShareImage()

  return (
    <Link
      asChild
      // @ts-expect-error
      href=""
    >
      <Link.Trigger>{children}</Link.Trigger>

      <Link.Menu>
        <Link.MenuAction
          icon="square.on.square"
          onPress={() => {
            copy({
              url,
            })
          }}
          title={t('copy')}
        />

        <Link.MenuAction
          icon="square.and.arrow.up"
          onPress={() => {
            share({
              url,
            })
          }}
          title={t('share')}
        />

        <Link.MenuAction
          icon="square.and.arrow.down"
          onPress={() => {
            download({
              url,
            })
          }}
          title={t('download')}
        />
      </Link.Menu>
    </Link>
  )
}
