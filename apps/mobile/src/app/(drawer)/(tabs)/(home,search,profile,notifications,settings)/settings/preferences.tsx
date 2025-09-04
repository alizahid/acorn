import { ScrollView } from 'react-native'
import { useFormatter, useTranslations } from 'use-intl'

import { FloatingButtonSide } from '~/components/common/floating-button'
import { Icon } from '~/components/common/icon'
import { SymbolIcon } from '~/components/common/icon/symbol'
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
    hideSeen,
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
          icon={<Icon name="Medal" />}
          label={t('browsing.showFlair')}
          onChange={(next) => {
            update({
              showFlair: next,
            })
          }}
          value={showFlair}
        />

        <Menu.Switch
          icon={<Icon name="ArrowUp" />}
          label={t('browsing.communityOnTop')}
          onChange={(next) => {
            update({
              communityOnTop: next,
            })
          }}
          value={communityOnTop}
        />

        <Menu.Switch
          icon={<Icon name="Infinity" />}
          label={t('browsing.infiniteScrolling')}
          onChange={(next) => {
            update({
              infiniteScrolling: next,
            })
          }}
          value={infiniteScrolling}
        />

        <Menu.Switch
          icon={<Icon name="TextB" />}
          label={t('browsing.boldTitle')}
          onChange={(next) => {
            update({
              boldTitle: next,
            })
          }}
          value={boldTitle}
        />

        <Menu.Switch
          icon={<Icon name="BookmarkSimple" />}
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
          icon={<Icon name="Clock" />}
          label={t('browsing.refreshInterval.label')}
          onChange={(next) => {
            update({
              refreshInterval: next,
            })
          }}
          options={[
            {
              label: t('refreshInterval.instant'),
              right: <SymbolIcon name="0.circle.fill" />,
              value: 0,
            },
            {
              label: f.number(5, {
                style: 'unit',
                unit: 'minute',
              }),
              right: <SymbolIcon name="5.circle.fill" />,
              value: 5,
            },
            {
              label: f.number(10, {
                style: 'unit',
                unit: 'minute',
              }),
              right: <SymbolIcon name="10.circle.fill" />,
              value: 10,
            },
            {
              label: f.number(15, {
                style: 'unit',
                unit: 'minute',
              }),
              right: <SymbolIcon name="15.circle.fill" />,
              value: 15,
            },
            {
              label: f.number(30, {
                style: 'unit',
                unit: 'minute',
              }),
              right: <SymbolIcon name="30.circle.fill" />,
              value: 30,
            },
            {
              label: t('refreshInterval.never'),
              right: <SymbolIcon name="infinity.circle.fill" />,
              value: Number.POSITIVE_INFINITY,
            },
          ]}
          value={refreshInterval}
        />

        <Menu.Switch
          icon={<Icon name="Alien" />}
          label={t('browsing.oldReddit')}
          onChange={(next) => {
            update({
              oldReddit: next,
            })
          }}
          value={oldReddit}
        />

        <Menu.Switch
          icon={<Icon name="ArrowUp" />}
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
            icon={<Icon name="Sidebar" />}
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
          icon={<Icon name="PushPin" />}
          label={t('comments.collapseAutoModerator')}
          onChange={(next) => {
            update({
              collapseAutoModerator: next,
            })
          }}
          value={collapseAutoModerator}
        />

        <Menu.Switch
          icon={<Icon name="ArrowsInLineVertical" />}
          label={t('comments.collapsibleComments')}
          onChange={(next) => {
            update({
              collapsibleComments: next,
            })
          }}
          value={collapsibleComments}
        />

        <Menu.Switch
          icon={<Icon name="ArrowUp" />}
          label={t('comments.userOnTop')}
          onChange={(next) => {
            update({
              userOnTop: next,
            })
          }}
          value={userOnTop}
        />

        <Menu.Options
          icon={<Icon name="ArrowDown" />}
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
                    ? 'ArrowLeft'
                    : item === 'center'
                      ? 'ArrowDown'
                      : item === 'right'
                        ? 'ArrowRight'
                        : 'EyeClosed'
                }
                weight="bold"
              />
            ),
            value: item,
          }))}
          value={skipComment}
        />

        <Menu.Options
          icon={<Icon name="ArrowBendUpLeft" />}
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
                    ? 'ArrowLeft'
                    : item === 'center'
                      ? 'ArrowDown'
                      : item === 'right'
                        ? 'ArrowRight'
                        : 'EyeClosed'
                }
                weight="bold"
              />
            ),
            value: item,
          }))}
          value={replyPost}
        />

        <Menu.Separator />

        <Menu.Label>{t('history.title')}</Menu.Label>

        <Menu.Switch
          icon={<Icon name="ArrowFatUp" />}
          label={t('history.seenOnVote')}
          onChange={(next) => {
            update({
              seenOnVote: next,
            })
          }}
          value={seenOnVote}
        />

        <Menu.Switch
          icon={<Icon name="Image" />}
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
          icon={<Icon name="MouseScroll" />}
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
          icon={<Icon name="Clock" />}
          label={t('history.seenOnScrollDelay.label')}
          onChange={(next) => {
            update({
              seenOnScrollDelay: next,
            })
          }}
          options={[
            {
              label: t('refreshInterval.instant'),
              right: <SymbolIcon name="0.circle.fill" />,
              value: 0,
            },
            {
              label: f.number(1, {
                style: 'unit',
                unit: 'second',
              }),
              right: <SymbolIcon name="1.circle.fill" />,
              value: 1,
            },
            {
              label: f.number(2, {
                style: 'unit',
                unit: 'second',
              }),
              right: <SymbolIcon name="2.circle.fill" />,
              value: 2,
            },
            {
              label: f.number(3, {
                style: 'unit',
                unit: 'second',
              }),
              right: <SymbolIcon name="3.circle.fill" />,
              value: 3,
            },
            {
              label: f.number(5, {
                style: 'unit',
                unit: 'second',
              }),
              right: <SymbolIcon name="5.circle.fill" />,
              value: 5,
            },
            {
              label: f.number(10, {
                style: 'unit',
                unit: 'second',
              }),
              right: <SymbolIcon name="10.circle.fill" />,
              value: 10,
            },
          ]}
          value={seenOnScrollDelay}
        />

        <Menu.Switch
          icon={<Icon name="SunDim" />}
          label={t('history.dimSeen')}
          onChange={(next) => {
            update({
              dimSeen: next,
            })
          }}
          value={dimSeen}
        />

        <Menu.Switch
          description={t('history.hideSeen.description')}
          icon={<Icon name="Eye" />}
          label={t('history.hideSeen.label')}
          onChange={(next) => {
            update({
              hideSeen: next,
            })
          }}
          value={hideSeen}
        />

        <Menu.Separator />

        <Menu.Label>{t('media.title')}</Menu.Label>

        <Menu.Switch
          icon={<Icon name="Play" />}
          label={t('media.autoPlay')}
          onChange={(next) => {
            update({
              autoPlay: next,
            })
          }}
          value={autoPlay}
        />

        <Menu.Switch
          icon={<Icon name="SpeakerSimpleX" />}
          label={t('media.feedMuted')}
          onChange={(next) => {
            update({
              feedMuted: next,
            })
          }}
          value={feedMuted}
        />

        <Menu.Switch
          icon={<Icon name="SpeakerSimpleHigh" />}
          label={t('media.unmuteFullscreen')}
          onChange={(next) => {
            update({
              unmuteFullscreen: next,
            })
          }}
          value={unmuteFullscreen}
        />

        <Menu.Switch
          icon={<Icon name="PictureInPicture" />}
          label={t('media.pictureInPicture')}
          onChange={(next) => {
            update({
              pictureInPicture: next,
            })
          }}
          value={pictureInPicture}
        />

        <Menu.Switch
          icon={<Icon name="EyeClosed" />}
          label={t('media.blurNsfw')}
          onChange={(next) => {
            update({
              blurNsfw: next,
            })
          }}
          value={blurNsfw}
        />

        <Menu.Switch
          icon={<Icon name="EyeClosed" />}
          label={t('media.blurSpoiler')}
          onChange={(next) => {
            update({
              blurSpoiler: next,
            })
          }}
          value={blurSpoiler}
        />

        <Menu.Switch
          icon={<Icon name="Image" />}
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
          icon={<Icon name="Browser" />}
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
          icon={<Icon name="Vibrate" />}
          label={t('feedback.feedbackHaptics')}
          onChange={(next) => {
            update({
              feedbackHaptics: next,
            })
          }}
          value={feedbackHaptics}
        />

        <Menu.Switch
          icon={<Icon name="MegaphoneSimple" />}
          label={t('feedback.hapticsLoud')}
          onChange={(next) => {
            update({
              hapticsLoud: next,
            })
          }}
          value={hapticsLoud}
        />

        <Menu.Switch
          icon={<Icon name="SpeakerSimpleHigh" />}
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
