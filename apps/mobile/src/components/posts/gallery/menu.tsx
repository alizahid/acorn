import { type ReactNode } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { useTranslations } from 'use-intl'

import { ContextMenu } from '~/components/common/context-menu'
import { useCopyImage, useDownloadImage, useShareImage } from '~/hooks/image'

type Props = {
  children: ReactNode
  onPress?: () => void
  style?: StyleProp<ViewStyle>
  url: string
}

export function ImageMenu({ children, onPress, style, url }: Props) {
  const t = useTranslations('component.posts.link')
  const a11y = useTranslations('a11y')

  const { download } = useDownloadImage()
  const { copy } = useCopyImage()
  const { share } = useShareImage()

  return (
    <ContextMenu
      label={a11y('imageMenu')}
      onPress={onPress}
      options={[
        {
          action() {
            copy({
              url,
            })
          },
          icon: {
            name: 'copy-duotone',
            type: 'icon',
          },
          id: 'copy',
          title: t('copy'),
        },
        {
          action() {
            share({
              url,
            })
          },
          icon: {
            name: 'share-duotone',
            type: 'icon',
          },
          id: 'share',
          title: t('share'),
        },
        {
          action() {
            download({
              url,
            })
          },
          icon: {
            name: 'download-duotone',
            type: 'icon',
          },
          id: 'download',
          title: t('download'),
        },
      ]}
      style={style}
    >
      {children}
    </ContextMenu>
  )
}
