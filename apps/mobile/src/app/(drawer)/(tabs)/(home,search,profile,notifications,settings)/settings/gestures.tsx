import { ScrollView } from 'react-native-gesture-handler'
import { useTranslations } from 'use-intl'

import { type GestureAction } from '~/components/common/gestures'
import {
  GestureColors,
  GestureIcons,
} from '~/components/common/gestures/actions'
import { Icon } from '~/components/common/icon'
import { Menu } from '~/components/common/menu'
import { type MenuItemOption } from '~/components/common/menu/item/options'
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
  } = useGestures([
    'commentLeft',
    'commentLeftLong',
    'commentLeftShort',
    'commentRight',
    'commentRightLong',
    'commentRightShort',
    'postLeft',
    'postLeftLong',
    'postLeftShort',
    'postRight',
    'postRightLong',
    'postRightShort',
  ])

  const postOptions: Array<MenuItemOption<GestureAction>> = [
    {
      label: t('options.upvote'),
      right: (
        <Icon
          name={GestureIcons.upvote}
          uniProps={(theme) => ({
            tintColor: theme.colors[GestureColors.upvote].accent,
          })}
        />
      ),
      value: 'upvote',
    },
    {
      label: t('options.downvote'),
      right: (
        <Icon
          name={GestureIcons.downvote}
          uniProps={(theme) => ({
            tintColor: theme.colors[GestureColors.downvote].accent,
          })}
        />
      ),
      value: 'downvote',
    },
    {
      label: t('options.reply'),
      right: (
        <Icon
          name={GestureIcons.reply}
          uniProps={(theme) => ({
            tintColor: theme.colors[GestureColors.reply].accent,
          })}
        />
      ),
      value: 'reply',
    },
    {
      label: t('options.save'),
      right: (
        <Icon
          name={GestureIcons.save}
          uniProps={(theme) => ({
            tintColor: theme.colors[GestureColors.save].accent,
          })}
        />
      ),
      value: 'save',
    },
    {
      label: t('options.hide'),
      right: (
        <Icon
          name={GestureIcons.hide}
          uniProps={(theme) => ({
            tintColor: theme.colors[GestureColors.hide].accent,
          })}
        />
      ),
      value: 'hide',
    },
    {
      label: t('options.share'),
      right: (
        <Icon
          name={GestureIcons.share}
          uniProps={(theme) => ({
            tintColor: theme.colors[GestureColors.share].accent,
          })}
        />
      ),
      value: 'share',
    },
  ]

  const commentOptions: Array<MenuItemOption<GestureAction>> = [
    ...postOptions,
    {
      label: t('options.collapse'),
      right: (
        <Icon
          name={GestureIcons.collapse}
          uniProps={(theme) => ({
            tintColor: theme.colors[GestureColors.collapse].accent,
          })}
        />
      ),
      value: 'collapse',
    },
  ]

  return (
    <ScrollView>
      <Menu.Root>
        <Menu.Label>{t('menu.posts')}</Menu.Label>

        <Menu.Switch
          icon={<Icon name="hand.point.left" />}
          label={t('menu.left')}
          onChange={(next) => {
            update({
              postLeft: next,
            })
          }}
          value={postLeft}
        />

        {postLeft ? (
          <>
            <Menu.Options
              label={t('menu.short')}
              onChange={(next) => {
                update({
                  postLeftShort: next as GestureAction,
                })
              }}
              options={postOptions}
              value={postLeftShort}
            />

            <Menu.Options
              label={t('menu.long')}
              onChange={(next) => {
                update({
                  postLeftLong: next as GestureAction,
                })
              }}
              options={postOptions}
              value={postLeftLong}
            />
          </>
        ) : null}

        <Menu.Switch
          icon={<Icon name="hand.point.right" />}
          label={t('menu.right')}
          onChange={(next) => {
            update({
              postRight: next,
            })
          }}
          value={postRight}
        />

        {postRight ? (
          <>
            <Menu.Options
              label={t('menu.short')}
              onChange={(next) => {
                update({
                  postRightShort: next as GestureAction,
                })
              }}
              options={postOptions}
              value={postRightShort}
            />

            <Menu.Options
              label={t('menu.long')}
              onChange={(next) => {
                update({
                  postRightLong: next as GestureAction,
                })
              }}
              options={postOptions}
              value={postRightLong}
            />
          </>
        ) : null}

        <Menu.Separator />

        <Menu.Label>{t('menu.comments')}</Menu.Label>

        <Menu.Switch
          icon={<Icon name="hand.point.left" />}
          label={t('menu.left')}
          onChange={(next) => {
            update({
              commentLeft: next,
            })
          }}
          value={commentLeft}
        />

        {commentLeft ? (
          <>
            <Menu.Options
              label={t('menu.short')}
              onChange={(next) => {
                update({
                  commentLeftShort: next as GestureAction,
                })
              }}
              options={commentOptions}
              value={commentLeftShort}
            />

            <Menu.Options
              label={t('menu.long')}
              onChange={(next) => {
                update({
                  commentLeftLong: next as GestureAction,
                })
              }}
              options={commentOptions}
              value={commentLeftLong}
            />
          </>
        ) : null}

        <Menu.Switch
          icon={<Icon name="hand.point.right" />}
          label={t('menu.right')}
          onChange={(next) => {
            update({
              commentRight: next,
            })
          }}
          value={commentRight}
        />

        {commentRight ? (
          <>
            <Menu.Options
              label={t('menu.short')}
              onChange={(next) => {
                update({
                  commentRightShort: next as GestureAction,
                })
              }}
              options={commentOptions}
              value={commentRightShort}
            />

            <Menu.Options
              label={t('menu.long')}
              onChange={(next) => {
                update({
                  commentRightLong: next as GestureAction,
                })
              }}
              options={commentOptions}
              value={commentRightLong}
            />
          </>
        ) : null}
      </Menu.Root>
    </ScrollView>
  )
}
