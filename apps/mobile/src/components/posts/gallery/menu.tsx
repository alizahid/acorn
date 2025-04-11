import { type ReactNode } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { ContextMenu } from '~/components/common/context-menu'
import { useCopyImage, useDownloadImage, useShareImage } from '~/hooks/image'
import { type PostMedia } from '~/types/post'

type Props = {
  children: ReactNode
  image: PostMedia
  onPress?: () => void
  style?: StyleProp<ViewStyle>
}

export function ImageMenu({ children, image, onPress, style }: Props) {
  const t = useTranslations('component.posts.link')
  const a11y = useTranslations('a11y')

  const { theme } = useStyles()

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
              url: image.url,
            })
          },
          icon: {
            color: theme.colors.gray.text,
            name: 'copy-duotone',
            type: 'icon',
          },
          id: 'copy',
          title: t('copy'),
        },
        {
          action() {
            share({
              url: image.url,
            })
          },
          icon: {
            color: theme.colors.gray.text,
            name: 'share-duotone',
            type: 'icon',
          },
          id: 'share',
          title: t('share'),
        },
        {
          action() {
            download({
              url: image.url,
            })
          },
          icon: {
            color: theme.colors.gray.text,
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
