import { useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { type GestureAction } from '~/components/common/gestures'
import { Icon } from '~/components/common/icon'
import { Menu, type MenuItemOption } from '~/components/common/menu'
import { useList } from '~/hooks/list'
import { useGestures } from '~/stores/gestures'

export default function Screen() {
  const t = useTranslations('screen.settings.gestures')

  const {
    commentLeft,
    commentLeftLong,
    commentLeftShort,
    commentRight,
    commentRightLong,
    commentRightShort,
    postLeft,
    postLeftLong,
    postLeftShort,
    postRight,
    postRightLong,
    postRightShort,
    update,
  } = useGestures()

  const { theme } = useStyles()

  const listProps = useList()

  const options: Array<MenuItemOption> = [
    {
      icon: {
        color: theme.colors.orange.accent,
        name: 'ArrowFatUp',
        type: 'icon',
      },
      label: t('options.upvote'),
      right: (
        <Icon
          color={theme.colors.orange.accent}
          name="ArrowFatUp"
          weight="duotone"
        />
      ),
      value: 'upvote',
    },
    {
      icon: {
        color: theme.colors.violet.accent,
        name: 'ArrowFatDown',
        type: 'icon',
      },
      label: t('options.downvote'),
      right: (
        <Icon
          color={theme.colors.violet.accent}
          name="ArrowFatDown"
          weight="duotone"
        />
      ),
      value: 'downvote',
    },
    {
      icon: {
        color: theme.colors.blue.accent,
        name: 'ArrowBendUpLeft',
        type: 'icon',
      },
      label: t('options.reply'),
      right: (
        <Icon
          color={theme.colors.blue.accent}
          name="ArrowBendUpLeft"
          weight="duotone"
        />
      ),
      value: 'reply',
    },
    {
      icon: {
        color: theme.colors.green.accent,
        name: 'BookmarkSimple',
        type: 'icon',
      },
      label: t('options.save'),
      right: (
        <Icon
          color={theme.colors.green.accent}
          name="BookmarkSimple"
          weight="duotone"
        />
      ),
      value: 'save',
    },
    {
      icon: {
        color: theme.colors.red.accent,
        name: 'EyeClosed',
        type: 'icon',
      },
      label: t('options.hide'),
      right: (
        <Icon
          color={theme.colors.red.accent}
          name="EyeClosed"
          weight="duotone"
        />
      ),
      value: 'hide',
    },
    {
      icon: {
        color: theme.colors.accent.accent,
        name: 'Share',
        type: 'icon',
      },
      label: t('options.share'),
      right: (
        <Icon
          color={theme.colors.accent.accent}
          name="Share"
          weight="duotone"
        />
      ),
      value: 'share',
    },
  ]

  return (
    <Menu
      items={[
        t('menu.posts'),
        {
          label: t('menu.left'),
          onSelect(value) {
            update({
              postLeft: value,
            })
          },
          type: 'switch',
          value: postLeft,
        },
        {
          label: t('menu.short'),
          onSelect(value) {
            update({
              postLeftShort: value as GestureAction,
            })
          },
          options,
          type: 'options',
          value: postLeftShort,
        },
        {
          label: t('menu.long'),
          onSelect(value) {
            update({
              postLeftLong: value as GestureAction,
            })
          },
          options,
          type: 'options',
          value: postLeftLong,
        },
        {
          label: t('menu.right'),
          onSelect(value) {
            update({
              postRight: value,
            })
          },
          type: 'switch',
          value: postRight,
        },
        {
          label: t('menu.short'),
          onSelect(value) {
            update({
              postRightShort: value as GestureAction,
            })
          },
          options,
          type: 'options',
          value: postRightShort,
        },
        {
          label: t('menu.long'),
          onSelect(value) {
            update({
              postRightLong: value as GestureAction,
            })
          },
          options,
          type: 'options',
          value: postRightLong,
        },
        null,

        t('menu.comments'),
        {
          label: t('menu.left'),
          onSelect(value) {
            update({
              commentLeft: value,
            })
          },
          type: 'switch',
          value: commentLeft,
        },
        {
          label: t('menu.short'),
          onSelect(value) {
            update({
              commentLeftShort: value as GestureAction,
            })
          },
          options,
          type: 'options',
          value: commentLeftShort,
        },
        {
          label: t('menu.long'),
          onSelect(value) {
            update({
              commentLeftLong: value as GestureAction,
            })
          },
          options,
          type: 'options',
          value: commentLeftLong,
        },
        {
          label: t('menu.right'),
          onSelect(value) {
            update({
              commentRight: value,
            })
          },
          type: 'switch',
          value: commentRight,
        },
        {
          label: t('menu.short'),
          onSelect(value) {
            update({
              commentRightShort: value as GestureAction,
            })
          },
          options,
          type: 'options',
          value: commentRightShort,
        },
        {
          label: t('menu.long'),
          onSelect(value) {
            update({
              commentRightLong: value as GestureAction,
            })
          },
          options,
          type: 'options',
          value: commentRightLong,
        },
      ]}
      listProps={listProps}
    />
  )
}
