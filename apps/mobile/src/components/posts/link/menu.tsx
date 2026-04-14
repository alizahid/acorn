import { Link } from 'expo-router'
import { type ReactNode } from 'react'
import { Share } from 'react-native'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'

import { useCopy } from '~/hooks/copy'
import { useLink } from '~/hooks/link'

type Props = {
  children: ReactNode
  url: string
}

export function LinkMenu({ children, url }: Props) {
  const t = useTranslations('component.posts.link')
  const toasts = useTranslations('toasts')

  const { handleLink } = useLink()
  const { copy } = useCopy()

  return (
    <Link
      asChild
      // @ts-expect-error
      href={'' as HrefObject}
    >
      <Link.Trigger>{children}</Link.Trigger>

      <Link.Menu>
        <Link.MenuAction
          icon="safari"
          onPress={() => {
            handleLink(url)
          }}
        >
          {t('open')}
        </Link.MenuAction>

        <Link.MenuAction
          icon="square.on.square"
          onPress={() => {
            copy(url).then(() => {
              toast.success(toasts('link.copied'))
            })
          }}
        >
          {t('copy')}
        </Link.MenuAction>

        <Link.MenuAction
          icon="square.and.arrow.up"
          onPress={() => {
            Share.share({
              url,
            })
          }}
        >
          {t('share')}
        </Link.MenuAction>
      </Link.Menu>
    </Link>
  )
}
