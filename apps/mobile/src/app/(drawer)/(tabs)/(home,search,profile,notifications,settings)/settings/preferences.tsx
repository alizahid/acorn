import { ScrollView } from 'react-native'
import { useFormatter, useTranslations } from 'use-intl'

import { FloatingButtonSide } from '~/components/common/floating-button'
import { Icon } from '~/components/common/icon'
import { Logo } from '~/components/common/logo'
import { Menu } from '~/components/common/menu'
import { useList } from '~/hooks/list'
import { iPad } from '~/lib/common'
import { type PreferencesPayload, usePreferences } from '~/stores/preferences'

export default function Screen() {
  const t = useTranslations('screen.settings.preferences')
  const f = useFormatter()

  const {
    autoPlay,
    blurNsfw,
    blurSpoiler,
    boldTitle,
    collapseAutoModerator,
    collapsibleComments,
    communityOnTop,
    dimSeen,
    feedbackHaptics,
    feedbackSounds,
    feedMuted,
    hapticsLoud,
    hidePostActions,
    infiniteScrolling,
    linkBrowser,
    oldReddit,
    pictureInPicture,
    refreshInterval,
    replyPost,
    saveToAlbum,
    seenOnMedia,
    seenOnScroll,
    seenOnScrollDelay,
    seenOnVote,
    showFlair,
    skipComment,
    stickyDrawer,
    unmuteFullscreen,
    update,
    upvoteOnSave,
    userOnTop,
  } = usePreferences()

  const listProps = useList()

  return (
    <ScrollView {...listProps}>
      <Menu.Root>
        <Menu.Label>{t('browsing.title')}</Menu.Label>

        <Menu.Switch
          icon={<Icon name="medal" />}
          label={t('browsing.showFlair')}
          onChange={(next) => {
            update({
              showFlair: next,
            })
          }}
          value={showFlair}
        />

        <Menu.Switch
          icon={<Icon name="arrow.up" />}
          label={t('browsing.communityOnTop')}
          onChange={(next) => {
            update({
              communityOnTop: next,
            })
          }}
          value={communityOnTop}
        />

        <Menu.Switch
          icon={<Icon name="infinity" />}
          label={t('browsing.infiniteScrolling')}
          onChange={(next) => {
            update({
              infiniteScrolling: next,
            })
          }}
          value={infiniteScrolling}
        />

        <Menu.Switch
          icon={<Icon name="bold" />}
          label={t('browsing.boldTitle')}
          onChange={(next) => {
            update({
              boldTitle: next,
            })
          }}
          value={boldTitle}
        />

        <Menu.Switch
          icon={<Icon name="bookmark" />}
          label={t('browsing.hidePostActions')}
          onChange={(next) => {
            update({
              hidePostActions: next,
            })
          }}
          value={hidePostActions}
        />

        <Menu.Options
          description={t('browsing.refreshInterval.description')}
          icon={<Icon name="clock" />}
          label={t('browsing.refreshInterval.label')}
          onChange={(next) => {
            update({
              refreshInterval: next,
            })
          }}
          options={[
            {
              label: t('refreshInterval.instant'),
              right: <Icon name="0.circle.fill" />,
              value: 0,
            },
            {
              label: f.number(5, {
                style: 'unit',
                unit: 'minute',
              }),
              right: <Icon name="5.circle.fill" />,
              value: 5,
            },
            {
              label: f.number(10, {
                style: 'unit',
                unit: 'minute',
              }),
              right: <Icon name="10.circle.fill" />,
              value: 10,
            },
            {
              label: f.number(15, {
                style: 'unit',
                unit: 'minute',
              }),
              right: <Icon name="15.circle.fill" />,
              value: 15,
            },
            {
              label: f.number(30, {
                style: 'unit',
                unit: 'minute',
              }),
              right: <Icon name="30.circle.fill" />,
              value: 30,
            },
            {
              label: t('refreshInterval.never'),
              right: <Icon name="infinity.circle.fill" />,
              value: Number.POSITIVE_INFINITY,
            },
          ]}
          value={refreshInterval}
        />

        <Menu.Switch
          icon={<Icon />}
          label={t('browsing.oldReddit')}
          onChange={(next) => {
            update({
              oldReddit: next,
            })
          }}
          value={oldReddit}
        />

        <Menu.Switch
          icon={<Icon name="arrowshape.up" />}
          label={t('browsing.upvoteOnSave')}
          onChange={(next) => {
            update({
              upvoteOnSave: next,
            })
          }}
          value={upvoteOnSave}
        />

        {iPad ? (
          <Menu.Switch
            icon={<Icon name="sidebar.leading" />}
            label={t('browsing.stickyDrawer')}
            onChange={(next) => {
              update({
                stickyDrawer: next,
              })
            }}
            value={stickyDrawer}
          />
        ) : null}

        <Menu.Separator />

        <Menu.Label>{t('comments.title')}</Menu.Label>

        <Menu.Switch
          icon={<Icon name="pin" />}
          label={t('comments.collapseAutoModerator')}
          onChange={(next) => {
            update({
              collapseAutoModerator: next,
            })
          }}
          value={collapseAutoModerator}
        />

        <Menu.Switch
          icon={<Icon name="arrow.down.and.line.horizontal.and.arrow.up" />}
          label={t('comments.collapsibleComments')}
          onChange={(next) => {
            update({
              collapsibleComments: next,
            })
          }}
          value={collapsibleComments}
        />

        <Menu.Switch
          icon={<Icon name="arrow.up" />}
          label={t('comments.userOnTop')}
          onChange={(next) => {
            update({
              userOnTop: next,
            })
          }}
          value={userOnTop}
        />

        <Menu.Options
          icon={<Icon name="arrow.down" />}
          label={t('comments.skipComment')}
          onChange={(next) => {
            const payload: Partial<PreferencesPayload> = {
              skipComment: next,
            }

            if (next !== 'hide' && next === replyPost) {
              payload.replyPost = next === 'left' ? 'right' : 'left'
            }

            update(payload)
          }}
          options={FloatingButtonSide.map((item) => ({
            label: t(`side.${item}`),
            right: (
              <Icon
                name={
                  item === 'left'
                    ? 'arrow.left'
                    : item === 'center'
                      ? 'arrow.down'
                      : item === 'right'
                        ? 'arrow.right'
                        : 'eye.slash'
                }
              />
            ),
            value: item,
          }))}
          value={skipComment}
        />

        <Menu.Options
          icon={<Icon name="arrow.turn.up.left" />}
          label={t('comments.replyPost')}
          onChange={(next) => {
            const payload: Partial<PreferencesPayload> = {
              replyPost: next,
            }

            if (next !== 'hide' && next === skipComment) {
              payload.skipComment = next === 'left' ? 'right' : 'left'
            }

            update(payload)
          }}
          options={FloatingButtonSide.map((item) => ({
            label: t(`side.${item}`),
            right: (
              <Icon
                name={
                  item === 'left'
                    ? 'arrow.left'
                    : item === 'center'
                      ? 'arrow.down'
                      : item === 'right'
                        ? 'arrow.right'
                        : 'eye.slash'
                }
              />
            ),
            value: item,
          }))}
          value={replyPost}
        />

        <Menu.Separator />

        <Menu.Label>{t('history.title')}</Menu.Label>

        <Menu.Switch
          icon={<Icon name="arrowshape.up" />}
          label={t('history.seenOnVote')}
          onChange={(next) => {
            update({
              seenOnVote: next,
            })
          }}
          value={seenOnVote}
        />

        <Menu.Switch
          icon={<Icon name="photo" />}
          label={t('history.seenOnMedia')}
          onChange={(next) => {
            update({
              seenOnMedia: next,
            })
          }}
          value={seenOnMedia}
        />

        <Menu.Switch
          description={t('history.seenOnScroll.description')}
          icon={<Icon name="iphone" />}
          label={t('history.seenOnScroll.label')}
          onChange={(next) => {
            update({
              seenOnScroll: next,
            })
          }}
          value={seenOnScroll}
        />

        <Menu.Options
          description={t('history.seenOnScrollDelay.description')}
          icon={<Icon name="clock" />}
          label={t('history.seenOnScrollDelay.label')}
          onChange={(next) => {
            update({
              seenOnScrollDelay: next,
            })
          }}
          options={[
            {
              label: t('refreshInterval.instant'),
              right: <Icon name="0.circle.fill" />,
              value: 0,
            },
            {
              label: f.number(1, {
                style: 'unit',
                unit: 'second',
              }),
              right: <Icon name="1.circle.fill" />,
              value: 1,
            },
            {
              label: f.number(2, {
                style: 'unit',
                unit: 'second',
              }),
              right: <Icon name="2.circle.fill" />,
              value: 2,
            },
            {
              label: f.number(3, {
                style: 'unit',
                unit: 'second',
              }),
              right: <Icon name="3.circle.fill" />,
              value: 3,
            },
            {
              label: f.number(5, {
                style: 'unit',
                unit: 'second',
              }),
              right: <Icon name="5.circle.fill" />,
              value: 5,
            },
            {
              label: f.number(10, {
                style: 'unit',
                unit: 'second',
              }),
              right: <Icon name="10.circle.fill" />,
              value: 10,
            },
          ]}
          value={seenOnScrollDelay}
        />

        <Menu.Switch
          icon={<Icon name="sun.min" />}
          label={t('history.dimSeen')}
          onChange={(next) => {
            update({
              dimSeen: next,
            })
          }}
          value={dimSeen}
        />

        <Menu.Separator />

        <Menu.Label>{t('media.title')}</Menu.Label>

        <Menu.Switch
          icon={<Icon name="play" />}
          label={t('media.autoPlay')}
          onChange={(next) => {
            update({
              autoPlay: next,
            })
          }}
          value={autoPlay}
        />

        <Menu.Switch
          icon={<Icon name="speaker.slash" />}
          label={t('media.feedMuted')}
          onChange={(next) => {
            update({
              feedMuted: next,
            })
          }}
          value={feedMuted}
        />

        <Menu.Switch
          icon={<Icon name="speaker.2" />}
          label={t('media.unmuteFullscreen')}
          onChange={(next) => {
            update({
              unmuteFullscreen: next,
            })
          }}
          value={unmuteFullscreen}
        />

        <Menu.Switch
          icon={<Icon name="pip" />}
          label={t('media.pictureInPicture')}
          onChange={(next) => {
            update({
              pictureInPicture: next,
            })
          }}
          value={pictureInPicture}
        />

        <Menu.Switch
          icon={<Icon name="eye.slash" />}
          label={t('media.blurNsfw')}
          onChange={(next) => {
            update({
              blurNsfw: next,
            })
          }}
          value={blurNsfw}
        />

        <Menu.Switch
          icon={<Icon name="eye.slash" />}
          label={t('media.blurSpoiler')}
          onChange={(next) => {
            update({
              blurSpoiler: next,
            })
          }}
          value={blurSpoiler}
        />

        <Menu.Switch
          icon={<Logo size={24} />}
          label={t('media.saveToAlbum')}
          onChange={(next) => {
            update({
              saveToAlbum: next,
            })
          }}
          value={saveToAlbum}
        />
        <Menu.Separator />

        <Menu.Label>{t('system.title')}</Menu.Label>

        <Menu.Switch
          icon={<Icon name="safari" />}
          label={t('system.linkBrowser')}
          onChange={(next) => {
            update({
              linkBrowser: next,
            })
          }}
          value={linkBrowser}
        />
        <Menu.Separator />

        <Menu.Label>{t('feedback.title')}</Menu.Label>

        <Menu.Switch
          icon={<Icon name="hand.tap" />}
          label={t('feedback.feedbackHaptics')}
          onChange={(next) => {
            update({
              feedbackHaptics: next,
            })
          }}
          value={feedbackHaptics}
        />

        <Menu.Switch
          icon={<Icon name="megaphone" />}
          label={t('feedback.hapticsLoud')}
          onChange={(next) => {
            update({
              hapticsLoud: next,
            })
          }}
          value={hapticsLoud}
        />

        <Menu.Switch
          icon={<Icon name="speaker.2" />}
          label={t('feedback.feedbackSounds')}
          onChange={(next) => {
            update({
              feedbackSounds: next,
            })
          }}
          value={feedbackSounds}
        />
      </Menu.Root>
    </ScrollView>
  )
}
