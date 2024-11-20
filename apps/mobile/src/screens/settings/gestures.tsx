import { useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { Menu, type MenuItemOption } from '~/components/common/menu'
import { type GestureAction } from '~/components/posts/gestures'
import { usePreferences } from '~/stores/preferences'

export function SettingsGesturesScreen() {
  const t = useTranslations('screen.settings.gestures')

  const {
    swipeGestures,
    swipeLeftLong,
    swipeLeftShort,
    swipeRightLong,
    swipeRightShort,
    update,
  } = usePreferences()

  const { theme } = useStyles()

  const options: Array<MenuItemOption> = [
    {
      icon: {
        color: theme.colors.orange.a9,
        name: 'ArrowFatUp',
      },
      label: t('options.upvote'),
      right: (
        <Icon
          color={theme.colors.orange.a9}
          name="ArrowFatUp"
          weight="duotone"
        />
      ),
      value: 'upvote',
    },
    {
      icon: {
        color: theme.colors.violet.a9,
        name: 'ArrowFatDown',
      },
      label: t('options.downvote'),
      right: (
        <Icon
          color={theme.colors.violet.a9}
          name="ArrowFatDown"
          weight="duotone"
        />
      ),
      value: 'downvote',
    },
    {
      icon: {
        color: theme.colors.blue.a9,
        name: 'ArrowBendUpLeft',
      },
      label: t('options.reply'),
      right: (
        <Icon
          color={theme.colors.blue.a9}
          name="ArrowBendUpLeft"
          weight="duotone"
        />
      ),
      value: 'reply',
    },
    {
      icon: {
        color: theme.colors.green.a9,
        name: 'BookmarkSimple',
      },
      label: t('options.save'),
      right: (
        <Icon
          color={theme.colors.green.a9}
          name="BookmarkSimple"
          weight="duotone"
        />
      ),
      value: 'save',
    },
  ]

  return (
    <Menu
      items={[
        {
          label: t('menu.swipeGestures'),
          onSelect(value) {
            update({
              swipeGestures: value,
            })
          },
          type: 'switch',
          value: swipeGestures,
        },

        null,
        t('menu.left'),
        {
          label: t('menu.swipeLeftShort'),
          onSelect(value) {
            update({
              swipeLeftShort: value as GestureAction,
            })
          },
          options,
          type: 'options',
          value: swipeLeftShort,
        },
        {
          label: t('menu.swipeLeftLong'),
          onSelect(value) {
            update({
              swipeLeftLong: value as GestureAction,
            })
          },
          options,
          type: 'options',
          value: swipeLeftLong,
        },

        null,
        t('menu.right'),
        {
          label: t('menu.swipeRightShort'),
          onSelect(value) {
            update({
              swipeRightShort: value as GestureAction,
            })
          },
          options,
          type: 'options',
          value: swipeRightShort,
        },
        {
          label: t('menu.swipeRightLong'),
          onSelect(value) {
            update({
              swipeRightLong: value as GestureAction,
            })
          },
          options,
          type: 'options',
          value: swipeRightLong,
        },
      ]}
    />
  )
}
