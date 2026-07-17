import { ScrollView } from 'react-native-gesture-handler'
import { useTranslations } from 'use-intl'
import { useShallow } from 'zustand/react/shallow'

import { type GestureAction } from '~/components/common/gestures'
import { GestureColors } from '~/components/common/gestures/actions'
import { Icon } from '~/components/common/icon'
import { Menu } from '~/components/common/menu'
import { type MenuItemOption } from '~/components/common/menu/item/options'
import { useListProps } from '~/hooks/list'
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
  } = useGestures(
    useShallow((state) => ({
      commentLeft: state.commentLeft,
      commentLeftLong: state.commentLeftLong,
      commentLeftShort: state.commentLeftShort,
      commentRight: state.commentRight,
      commentRightLong: state.commentRightLong,
      commentRightShort: state.commentRightShort,
      postLeft: state.postLeft,
      postLeftLong: state.postLeftLong,
      postLeftShort: state.postLeftShort,
      postRight: state.postRight,
      postRightLong: state.postRightLong,
      postRightShort: state.postRightShort,
      update: state.update,
    })),
  )

  const postOptions: Array<MenuItemOption<GestureAction>> = [
    {
      label: t('options.upvote'),
      right: (
        <Icon
          name="arrow-fat-up"
          uniProps={(theme) => ({
            color: theme.colors[GestureColors.upvote].accent,
          })}
        />
      ),
      value: 'upvote',
    },
    {
      label: t('options.downvote'),
      right: (
        <Icon
          name="arrow-fat-down"
          uniProps={(theme) => ({
            color: theme.colors[GestureColors.downvote].accent,
          })}
        />
      ),
      value: 'downvote',
    },
    {
      label: t('options.reply'),
      right: (
        <Icon
          name="arrow-bend-up-left-bold"
          uniProps={(theme) => ({
            color: theme.colors[GestureColors.reply].accent,
          })}
        />
      ),
      value: 'reply',
    },
    {
      label: t('options.save'),
      right: (
        <Icon
          name="bookmark-simple"
          uniProps={(theme) => ({
            color: theme.colors[GestureColors.save].accent,
          })}
        />
      ),
      value: 'save',
    },
    {
      label: t('options.hide'),
      right: (
        <Icon
          name="eye-slash"
          uniProps={(theme) => ({
            color: theme.colors[GestureColors.hide].accent,
          })}
        />
      ),
      value: 'hide',
    },
    {
      label: t('options.share'),
      right: (
        <Icon
          name="export"
          uniProps={(theme) => ({
            color: theme.colors[GestureColors.share].accent,
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
          name="arrows-in-line-vertical"
          uniProps={(theme) => ({
            color: theme.colors[GestureColors.collapse].accent,
          })}
        />
      ),
      value: 'collapse',
    },
    {
      label: t('options.collapseThread'),
      right: (
        <Icon
          name="arrows-in-line-horizontal"
          uniProps={(theme) => ({
            color: theme.colors[GestureColors.collapse].accent,
          })}
        />
      ),
      value: 'collapseThread',
    },
  ]

  const listProps = useListProps()

  return (
    <ScrollView {...listProps}>
      <Menu.Root>
        <Menu.Label>{t('menu.posts')}</Menu.Label>

        <Menu.Switch
          icon={<Icon name="hand-swipe-left" />}
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
          icon={<Icon name="hand-swipe-right" />}
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
          icon={<Icon name="hand-swipe-left" />}
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
          icon={<Icon name="hand-swipe-right" />}
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
