import { useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import {
  Menu,
  type MenuItem,
  type MenuItemOption,
} from '~/components/common/menu'
import { useList } from '~/hooks/list'
import { usePreferences } from '~/stores/preferences'

export default function Screen() {
  const t = useTranslations('screen.settings.gestures')

  const { commentGestures, postGestures, swipeGestures, update } =
    usePreferences()

  const { theme } = useStyles()

  const listProps = useList()

  const options: Array<MenuItemOption> = [
    {
      icon: {
        color: theme.colors.orange[9],
        name: 'ArrowFatUp',
        type: 'icon',
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
        color: theme.colors.violet[9],
        name: 'ArrowFatDown',
        type: 'icon',
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
        color: theme.colors.blue[9],
        name: 'ArrowBendUpLeft',
        type: 'icon',
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
        color: theme.colors.green[9],
        name: 'BookmarkSimple',
        type: 'icon',
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
    {
      icon: {
        color: theme.colors.red[9],
        name: 'EyeClosed',
        type: 'icon',
      },
      label: t('options.hide'),
      right: (
        <Icon color={theme.colors.red.a9} name="EyeClosed" weight="duotone" />
      ),
      value: 'hide',
    },
    {
      icon: {
        color: theme.colors.accent[9],
        name: 'Share',
        type: 'icon',
      },
      label: t('options.share'),
      right: (
        <Icon color={theme.colors.accent.a9} name="Share" weight="duotone" />
      ),
      value: 'share',
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

        ...(
          [
            {
              key: 'posts',
              value: postGestures,
            },
            {
              key: 'comments',
              value: commentGestures,
            },
          ] as const
        ).flatMap((item) => [
          null,
          t(`menu.${item.key}`),
          ...(
            ['leftShort', 'leftLong', 'rightShort', 'rightLong'] as const
          ).map<MenuItem>((gesture) => ({
            label: t(`menu.${gesture}`),
            onSelect(value) {
              update({
                [item.key === 'posts' ? 'postGestures' : 'commentGestures']: {
                  ...item.value,
                  [gesture]: value,
                },
              })
            },
            options,
            type: 'options',
            value: item.value[gesture],
          })),
        ]),
      ]}
      listProps={listProps}
    />
  )
}
