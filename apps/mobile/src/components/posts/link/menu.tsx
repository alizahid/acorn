import { type ReactNode } from 'react'
import { Share, type StyleProp, type ViewStyle } from 'react-native'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'

import { ContextMenu } from '@/context-menu'
import { useCopy } from '~/hooks/copy'
import { useLink } from '~/hooks/link'

type Props = {
  children: ReactNode
  style?: StyleProp<ViewStyle>
  url: string
}

export function LinkMenu({ children, style, url }: Props) {
  const t = useTranslations('component.posts.link')
  const toasts = useTranslations('toasts')
  const a11y = useTranslations('a11y')

  const { handleLink } = useLink()
  const { copy } = useCopy()

  return (
    <ContextMenu
      accessibilityLabel={a11y('viewLink')}
      options={[
        {
          icon: 'safari',
          id: 'open',
          onPress() {
            handleLink(url)
          },
          title: t('open'),
        },
        {
          icon: 'square.on.square',
          id: 'copy',
          onPress() {
            copy(url).then(() => {
              toast.success(toasts('link.copied'))
            })
          },
          title: t('copy'),
        },
        {
          icon: 'square.and.arrow.up',
          id: 'share',
          onPress() {
            Share.share({
              url,
            })
          },
          title: t('share'),
        },
      ]}
      style={style}
    >
      {children}
    </ContextMenu>
  )
}
