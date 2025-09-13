import { type ReactNode } from 'react'
import { Share, type StyleProp, type ViewStyle } from 'react-native'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'

import { ContextMenu } from '~/components/common/context-menu'
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
      label={a11y('viewLink')}
      options={[
        {
          action() {
            handleLink(url)
          },
          icon: {
            name: 'safari',
          },
          id: 'open',
          title: t('open'),
        },
        {
          action() {
            copy(url).then(() => {
              toast.success(toasts('link.copied'))
            })
          },
          icon: {
            name: 'square.on.square',
          },
          id: 'copy',
          title: t('copy'),
        },
        {
          action() {
            Share.share({
              url,
            })
          },
          icon: {
            name: 'square.and.arrow.up',
          },
          id: 'share',
          title: t('share'),
        },
      ]}
      style={style}
    >
      {children}
    </ContextMenu>
  )
}
