import { ScrollView } from 'react-native'
import { useTranslations } from 'use-intl'

import { type GestureAction } from '~/components/common/gestures'
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
          name="ArrowFatUp"
          uniProps={(theme) => ({
            color: theme.colors.orange.accent,
          })}
          weight="duotone"
        />
      ),
      value: 'upvote',
    },
    {
      label: t('options.downvote'),
      right: (
        <Icon
          name="ArrowFatDown"
          uniProps={(theme) => ({
            color: theme.colors.violet.accent,
          })}
          weight="duotone"
        />
      ),
      value: 'downvote',
    },
    {
      label: t('options.reply'),
      right: (
        <Icon
          name="ArrowBendUpLeft"
          uniProps={(theme) => ({
            color: theme.colors.blue.accent,
          })}
          weight="duotone"
        />
      ),
      value: 'reply',
    },
    {
      label: t('options.save'),
      right: (
        <Icon
          name="BookmarkSimple"
          uniProps={(theme) => ({
            color: theme.colors.green.accent,
          })}
          weight="duotone"
        />
      ),
      value: 'save',
    },
    {
      label: t('options.hide'),
      right: (
        <Icon
          name="EyeClosed"
          uniProps={(theme) => ({
            color: theme.colors.red.accent,
          })}
          weight="duotone"
        />
      ),
      value: 'hide',
    },
    {
      label: t('options.share'),
      right: (
        <Icon
          name="Share"
          uniProps={(theme) => ({
            color: theme.colors.accent.accent,
          })}
          weight="duotone"
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
          icon={<Icon name="ArrowArcLeft" />}
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
          icon={<Icon name="ArrowArcRight" />}
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
          icon={<Icon name="ArrowArcLeft" />}
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
          icon={<Icon name="ArrowArcRight" />}
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
