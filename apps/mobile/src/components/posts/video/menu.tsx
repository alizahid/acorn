import { Link } from 'expo-router'
import { type ReactNode } from 'react'
import { useTranslations } from 'use-intl'

import { useDownloadVideo } from '~/hooks/video'

type Props = {
  children: ReactNode
  url: string
}

export function VideoMenu({ children, url }: Props) {
  const t = useTranslations('component.posts.link')

  const { download } = useDownloadVideo()

  return (
    <Link
      asChild
      href="/"
      onPress={(event) => {
        event.preventDefault()
      }}
    >
      <Link.Trigger>{children}</Link.Trigger>

      <Link.Menu>
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
