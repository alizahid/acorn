import { requestPermissionsAsync } from 'expo-media-library'
import { ScrollView } from 'react-native-gesture-handler'
import { StyleSheet } from 'react-native-unistyles'
import { useFormatter, useTranslations } from 'use-intl'
import { useShallow } from 'zustand/react/shallow'

import { FloatingButtonSide } from '~/components/common/floating-button'
import { Icon } from '~/components/common/icon'
import { SFSymbol } from '~/components/common/icon/symbol'
import { Logo } from '~/components/common/logo'
import { Menu } from '~/components/common/menu'
import { useListProps } from '~/hooks/list'
import { iOS26 } from '~/lib/common'
import { type PreferencesPayload, usePreferences } from '~/stores/preferences'
import { space } from '~/styles/tokens'

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
    minimizeTabBar,
    oldReddit,
    pictureInPicture,
    privateScreenshots,
    refreshInterval,
    replyPost,
    saveToAlbum,
    seenOnMedia,
    seenOnScroll,
    seenOnScrollDelay,
    seenOnVote,
    showFlair,
    skipComment,
    unmuteFullscreen,
    upvoteOnSave,
    userOnTop,
    update,
  } = usePreferences(
    useShallow((state) => ({
      autoPlay: state.autoPlay,
      blurNsfw: state.blurNsfw,
      blurSpoiler: state.blurSpoiler,
      boldTitle: state.boldTitle,
      collapseAutoModerator: state.collapseAutoModerator,
      collapsibleComments: state.collapsibleComments,
      communityOnTop: state.communityOnTop,
      dimSeen: state.dimSeen,
      feedbackHaptics: state.feedbackHaptics,
      feedbackSounds: state.feedbackSounds,
      feedMuted: state.feedMuted,
      hapticsLoud: state.hapticsLoud,
      hidePostActions: state.hidePostActions,
      hideSeen: state.hideSeen,
      infiniteScrolling: state.infiniteScrolling,
      linkBrowser: state.linkBrowser,
      minimizeTabBar: state.minimizeTabBar,
      oldReddit: state.oldReddit,
      pictureInPicture: state.pictureInPicture,
      privateScreenshots: state.privateScreenshots,
      refreshInterval: state.refreshInterval,
      replyPost: state.replyPost,
      saveToAlbum: state.saveToAlbum,
      seenOnMedia: state.seenOnMedia,
      seenOnScroll: state.seenOnScroll,
      seenOnScrollDelay: state.seenOnScrollDelay,
      seenOnVote: state.seenOnVote,
      showFlair: state.showFlair,
      skipComment: state.skipComment,
      unmuteFullscreen: state.unmuteFullscreen,
      update: state.update,
      upvoteOnSave: state.upvoteOnSave,
      userOnTop: state.userOnTop,
    })),
  )

  const listProps = useListProps({
    extraBottom: space[4],
    extraTop: space[4],
  })

  return (
    <ScrollView {...listProps}>
      <Menu.Root>
        <Menu.Label>{t('browsing.title')}</Menu.Label>

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
              label: t('browsing.refreshInterval.instant'),
              right: <SFSymbol name="0.circle.fill" />,
              value: 0,
            },
            {
              label: f.number(5, {
                style: 'unit',
                unit: 'minute',
              }),
              right: <SFSymbol name="5.circle.fill" />,
              value: 5,
            },
            {
              label: f.number(10, {
                style: 'unit',
                unit: 'minute',
              }),
              right: <SFSymbol name="10.circle.fill" />,
              value: 10,
            },
            {
              label: f.number(15, {
                style: 'unit',
                unit: 'minute',
              }),
              right: <SFSymbol name="15.circle.fill" />,
              value: 15,
            },
            {
              label: f.number(30, {
                style: 'unit',
                unit: 'minute',
              }),
              right: <SFSymbol name="30.circle.fill" />,
              value: 30,
            },
            {
              label: t('browsing.refreshInterval.never'),
              right: <SFSymbol name="infinity.circle.fill" />,
              value: Number.POSITIVE_INFINITY,
            },
          ]}
          value={refreshInterval}
        />

        <Menu.Switch
          icon={<Icon name="link" />}
          label={t('browsing.oldReddit')}
          onChange={(next) => {
            update({
              oldReddit: next,
            })
          }}
          value={oldReddit}
        />

        {iOS26 ? (
          <Menu.Switch
            icon={<Icon name="eye-closed" />}
            label={t('browsing.minimizeTabBar')}
            onChange={(next) => {
              update({
                minimizeTabBar: next,
              })
            }}
            value={minimizeTabBar}
          />
        ) : null}

        <Menu.Switch
          icon={<Icon name="hand" />}
          label={t('browsing.privateScreenshots')}
          onChange={(next) => {
            update({
              privateScreenshots: next,
            })
          }}
          value={privateScreenshots}
        />

        <Menu.Separator />

        <Menu.Label>{t('posts.title')}</Menu.Label>

        <Menu.Switch
          icon={<Icon name="medal" />}
          label={t('posts.showFlair')}
          onChange={(next) => {
            update({
              showFlair: next,
            })
          }}
          value={showFlair}
        />

        <Menu.Switch
          icon={<Icon name="caret-up" />}
          label={t('posts.communityOnTop')}
          onChange={(next) => {
            update({
              communityOnTop: next,
            })
          }}
          value={communityOnTop}
        />

        <Menu.Switch
          icon={<Icon name="text-b-bold" />}
          label={t('posts.boldTitle')}
          onChange={(next) => {
            update({
              boldTitle: next,
            })
          }}
          value={boldTitle}
        />

        <Menu.Switch
          icon={<Icon name="bookmark-simple" />}
          label={t('posts.hidePostActions')}
          onChange={(next) => {
            update({
              hidePostActions: next,
            })
          }}
          value={hidePostActions}
        />

        <Menu.Switch
          icon={<Icon name="arrow-fat-up" />}
          label={t('posts.upvoteOnSave')}
          onChange={(next) => {
            update({
              upvoteOnSave: next,
            })
          }}
          value={upvoteOnSave}
        />

        <Menu.Separator />

        <Menu.Label>{t('comments.title')}</Menu.Label>

        <Menu.Switch
          icon={<Icon name="push-pin" />}
          label={t('comments.collapseAutoModerator')}
          onChange={(next) => {
            update({
              collapseAutoModerator: next,
            })
          }}
          value={collapseAutoModerator}
        />

        <Menu.Switch
          icon={<Icon name="arrows-in-line-vertical" />}
          label={t('comments.collapsibleComments')}
          onChange={(next) => {
            update({
              collapsibleComments: next,
            })
          }}
          value={collapsibleComments}
        />

        <Menu.Switch
          icon={<Icon name="caret-up" />}
          label={t('comments.userOnTop')}
          onChange={(next) => {
            update({
              userOnTop: next,
            })
          }}
          value={userOnTop}
        />

        <Menu.Options
          icon={<Icon name="arrow-down" />}
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
                    ? 'caret-left'
                    : item === 'center'
                      ? 'caret-down'
                      : item === 'right'
                        ? 'caret-right'
                        : 'eye-slash'
                }
              />
            ),
            value: item,
          }))}
          value={skipComment}
        />

        <Menu.Options
          icon={<Icon name="arrow-bend-up-left-bold" />}
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
                    ? 'caret-left'
                    : item === 'center'
                      ? 'caret-down'
                      : item === 'right'
                        ? 'caret-right'
                        : 'eye-slash'
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
          icon={<Icon name="arrow-fat-up" />}
          label={t('history.seenOnVote')}
          onChange={(next) => {
            update({
              seenOnVote: next,
            })
          }}
          value={seenOnVote}
        />

        <Menu.Switch
          icon={<Icon name="image" />}
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
          icon={<Icon name="mouse-scroll" />}
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
              label: t('browsing.refreshInterval.instant'),
              right: <SFSymbol name="0.circle.fill" />,
              value: 0,
            },
            {
              label: f.number(1, {
                style: 'unit',
                unit: 'second',
              }),
              right: <SFSymbol name="1.circle.fill" />,
              value: 1,
            },
            {
              label: f.number(2, {
                style: 'unit',
                unit: 'second',
              }),
              right: <SFSymbol name="2.circle.fill" />,
              value: 2,
            },
            {
              label: f.number(3, {
                style: 'unit',
                unit: 'second',
              }),
              right: <SFSymbol name="3.circle.fill" />,
              value: 3,
            },
            {
              label: f.number(5, {
                style: 'unit',
                unit: 'second',
              }),
              right: <SFSymbol name="5.circle.fill" />,
              value: 5,
            },
            {
              label: f.number(10, {
                style: 'unit',
                unit: 'second',
              }),
              right: <SFSymbol name="10.circle.fill" />,
              value: 10,
            },
          ]}
          value={seenOnScrollDelay}
        />

        <Menu.Switch
          icon={<Icon name="sun-dim" />}
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
          icon={<Icon name="eye-slash" />}
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
          icon={<Icon name="speaker-x" />}
          label={t('media.feedMuted')}
          onChange={(next) => {
            update({
              feedMuted: next,
            })
          }}
          value={feedMuted}
        />

        <Menu.Switch
          icon={<Icon name="speaker-high" />}
          label={t('media.unmuteFullscreen')}
          onChange={(next) => {
            update({
              unmuteFullscreen: next,
            })
          }}
          value={unmuteFullscreen}
        />

        <Menu.Switch
          icon={<Icon name="picture-in-picture" />}
          label={t('media.pictureInPicture')}
          onChange={(next) => {
            update({
              pictureInPicture: next,
            })
          }}
          value={pictureInPicture}
        />

        <Menu.Switch
          icon={<Icon name="eye-slash" />}
          label={t('media.blurNsfw')}
          onChange={(next) => {
            update({
              blurNsfw: next,
            })
          }}
          value={blurNsfw}
        />

        <Menu.Switch
          icon={<Icon name="eye-slash" />}
          label={t('media.blurSpoiler')}
          onChange={(next) => {
            update({
              blurSpoiler: next,
            })
          }}
          value={blurSpoiler}
        />

        <Menu.Switch
          description={t('media.saveToAlbum.description')}
          icon={<Logo style={styles.logo} />}
          label={t('media.saveToAlbum.label')}
          onChange={async (next) => {
            if (next) {
              const { granted } = await requestPermissionsAsync(false)

              if (!granted) {
                return
              }
            }

            update({
              saveToAlbum: next,
            })
          }}
          value={saveToAlbum}
        />
        <Menu.Separator />

        <Menu.Label>{t('system.title')}</Menu.Label>

        <Menu.Switch
          icon={<Icon name="compass" />}
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
          icon={<Icon name="hand-tap" />}
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
          icon={<Icon name="speaker-high" />}
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

const styles = StyleSheet.create((theme) => ({
  logo: {
    height: theme.space[5],
    width: theme.space[5],
  },
}))
