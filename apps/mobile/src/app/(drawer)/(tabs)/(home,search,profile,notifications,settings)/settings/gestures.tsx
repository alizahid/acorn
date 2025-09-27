import { ScrollView } from 'react-native'
import { useTranslations } from 'use-intl'

import { type GestureAction } from '~/components/common/gestures'
import { GestureIcons } from '~/components/common/gestures/actions'
import { Icon } from '~/components/common/icon'
import { Menu } from '~/components/common/menu'
import { type MenuItemOption } from '~/components/common/menu/item/options'
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

  const listProps = useList()

  const options: Array<MenuItemOption<GestureAction>> = [
    {
      label: t('options.upvote'),
      right: (
        <Icon
          name={GestureIcons.upvote}
          uniProps={(theme) => ({
            tintColor: theme.colors.orange.accent,
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
            tintColor: theme.colors.violet.accent,
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
            tintColor: theme.colors.blue.accent,
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
            tintColor: theme.colors.green.accent,
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
            tintColor: theme.colors.red.accent,
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
            tintColor: theme.colors.accent.accent,
          })}
        />
      ),
      value: 'share',
    },
  ]

  return (
    <ScrollView {...listProps}>
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
              options={options}
              value={postLeftShort}
            />

            <Menu.Options
              label={t('menu.long')}
              onChange={(next) => {
                update({
                  postLeftLong: next as GestureAction,
                })
              }}
              options={options}
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
              options={options}
              value={postRightShort}
            />

            <Menu.Options
              label={t('menu.long')}
              onChange={(next) => {
                update({
                  postRightLong: next as GestureAction,
                })
              }}
              options={options}
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
              options={options}
              value={commentLeftShort}
            />

            <Menu.Options
              label={t('menu.long')}
              onChange={(next) => {
                update({
                  commentLeftLong: next as GestureAction,
                })
              }}
              options={options}
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
              options={options}
              value={commentRightShort}
            />

            <Menu.Options
              label={t('menu.long')}
              onChange={(next) => {
                update({
                  commentRightLong: next as GestureAction,
                })
              }}
              options={options}
              value={commentRightLong}
            />
          </>
        ) : null}
      </Menu.Root>
    </ScrollView>
  )
}
