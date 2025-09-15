import { type ReactNode } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { useTranslations } from 'use-intl'

import { ContextMenu } from '@/context-menu'
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
      accessibilityLabel={a11y('imageMenu')}
      onPressPreview={onPress}
      options={[
        {
          icon: 'square.on.square',
          id: 'copy',
          onPress() {
            copy({
              url,
            })
          },
          title: t('copy'),
        },
        {
          icon: 'square.and.arrow.up',
          id: 'share',
          onPress() {
            share({
              url,
            })
          },
          title: t('share'),
        },
        {
          icon: 'square.and.arrow.down',
          id: 'download',
          onPress() {
            download({
              url,
            })
          },
          title: t('download'),
        },
      ]}
      style={style}
    >
      {children}
    </ContextMenu>
  )
}
