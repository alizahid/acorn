import * as Clipboard from 'expo-clipboard'
import { useRouter } from 'expo-router'
import { type ReactNode } from 'react'
import { Share, type StyleProp, type ViewStyle } from 'react-native'
import { ContextMenuView } from 'react-native-ios-context-menu'
import { useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { menu } from '~/assets/menu'
import { useCopy } from '~/hooks/copy'
import { useLink } from '~/hooks/link'
import { useHide } from '~/hooks/moderation/hide'
import { type ReportReason, useReport } from '~/hooks/moderation/report'
import { usePostSave } from '~/hooks/mutations/posts/save'
import { usePostVote } from '~/hooks/mutations/posts/vote'
import { type Post } from '~/types/post'

type Props = {
  children: ReactNode
  onPress: () => void
  post: Post
  style?: StyleProp<ViewStyle>
}

export function PostMenu({ children, onPress, post, style }: Props) {
  const router = useRouter()

  const t = useTranslations('component.posts.menu')

  const { theme } = useStyles()

  const { vote } = usePostVote()
  const { save } = usePostSave()
  const { report } = useReport()

  const { copy } = useCopy()
  const { hide } = useHide()
  const { handleLink, open } = useLink()

  const reasons: Array<ReportReason> = [
    'community',
    'HARASSMENT',
    'VIOLENCE',
    'HATE_CONTENT',
    'MINOR_ABUSE_OR_SEXUALIZATION',
    'PII',
    'INVOLUNTARY_PORN',
    'PROHIBITED_SALES',
    'IMPERSONATION',
    'COPYRIGHT',
    'TRADEMARK',
    'SELF_HARM',
    'SPAM',
    'CONTRIBUTOR_PROGRAM',
  ]

  return (
    <ContextMenuView
      menuConfig={{
        menuItems: [
          {
            actionKey: 'upvote',
            actionTitle: t(post.liked ? 'removeUpvote' : 'upvote'),
            icon: {
              imageOptions: {
                tint: theme.colors.orange[9],
              },
              imageValue: menu.arrowFatUp,
              type: 'IMAGE_REQUIRE',
            },
          },
          {
            actionKey: 'downvote',
            actionTitle: t(
              post.liked === false ? 'removeDownvote' : 'downvote',
            ),
            icon: {
              imageOptions: {
                tint: theme.colors.violet[9],
              },
              imageValue: menu.arrowFatDown,
              type: 'IMAGE_REQUIRE',
            },
          },
          {
            actionKey: 'save',
            actionTitle: t(post.saved ? 'unsave' : 'save'),
            icon: {
              imageOptions: {
                tint: theme.colors.green[9],
              },
              imageValue: menu.bookmarkSimple,
              type: 'IMAGE_REQUIRE',
            },
          },
          {
            actionKey: 'reply',
            actionTitle: t('reply'),
            icon: {
              imageOptions: {
                tint: theme.colors.blue[9],
              },
              imageValue: menu.arrowBendUpLeft,
              type: 'IMAGE_REQUIRE',
            },
          },
          {
            menuItems: [
              {
                actionKey: 'copyText',
                actionTitle: t('copyText'),
                icon: {
                  imageOptions: {
                    tint: theme.colors.gray[12],
                  },
                  imageValue: menu.copy,
                  type: 'IMAGE_REQUIRE',
                },
              },
              {
                actionKey: 'openApp',
                actionTitle: t('openApp'),
                icon: {
                  imageOptions: {
                    tint: theme.colors.gray[12],
                  },
                  imageValue: menu.deviceMobileCamera,
                  type: 'IMAGE_REQUIRE',
                },
              },
              {
                actionKey: 'openBrowser',
                actionTitle: t('openBrowser'),
                icon: {
                  imageOptions: {
                    tint: theme.colors.gray[12],
                  },
                  imageValue: menu.compass,
                  type: 'IMAGE_REQUIRE',
                },
              },
              {
                actionKey: 'share',
                actionTitle: t('share'),
                icon: {
                  imageOptions: {
                    tint: theme.colors.gray[12],
                  },
                  imageValue: menu.share,
                  type: 'IMAGE_REQUIRE',
                },
              },
              {
                actionKey: 'copyLink',
                actionTitle: t('copyLink'),
                icon: {
                  imageOptions: {
                    tint: theme.colors.gray[12],
                  },
                  imageValue: menu.copy,
                  type: 'IMAGE_REQUIRE',
                },
              },
            ],
            menuOptions: ['displayInline'],
            menuTitle: '',
            type: 'menu',
          },
          {
            menuItems: [
              {
                actionKey: 'hidePost',
                actionTitle: t(post.hidden ? 'unhidePost' : 'hidePost'),
                icon: {
                  imageOptions: {
                    tint: theme.colors.gray[12],
                  },
                  imageValue: post.hidden ? menu.eye : menu.eyeClosed,
                  type: 'IMAGE_REQUIRE',
                },
              },
              {
                actionKey: 'hideUser',
                actionTitle: t('hideUser', {
                  user: post.user.name,
                }),
                icon: {
                  imageOptions: {
                    tint: theme.colors.gray[12],
                  },
                  imageValue: menu.user,
                  type: 'IMAGE_REQUIRE',
                },
              },
              {
                actionKey: 'hideCommunity',
                actionTitle: t('hideCommunity', {
                  community: post.community.name,
                }),
                icon: {
                  imageOptions: {
                    tint: theme.colors.gray[12],
                  },
                  imageValue: menu.usersFour,
                  type: 'IMAGE_REQUIRE',
                },
              },
            ],
            menuOptions: ['displayInline'],
            menuTitle: '',
            type: 'menu',
          },
          {
            menuItems: reasons.map((reason) => ({
              actionKey: reason,
              actionTitle: t(`report.${reason}`, {
                community: post.community.name,
              }),
            })),
            menuOptions: ['destructive'],
            menuTitle: t('report.title'),
            type: 'menu',
          },
        ],
        menuTitle: t('title.post'),
      }}
      onPressMenuItem={(event) => {
        if (event.nativeEvent.actionKey === 'upvote') {
          vote({
            direction: post.liked ? 0 : 1,
            postId: post.id,
          })
        }

        if (event.nativeEvent.actionKey === 'downvote') {
          vote({
            direction: post.liked === false ? 0 : -1,
            postId: post.id,
          })
        }

        if (event.nativeEvent.actionKey === 'reply') {
          router.navigate({
            params: {
              id: post.id,
            },
            pathname: '/posts/[id]/reply',
          })
        }

        if (event.nativeEvent.actionKey === 'save') {
          save({
            action: post.saved ? 'unsave' : 'save',
            postId: post.id,
          })
        }

        if (event.nativeEvent.actionKey === 'copyText' && post.body) {
          void Clipboard.setStringAsync(post.body)
        }

        if (event.nativeEvent.actionKey === 'openApp') {
          const url = new URL(post.permalink, 'https://reddit.com')

          void handleLink(url.toString())
        }

        if (event.nativeEvent.actionKey === 'openBrowser') {
          const url = new URL(post.permalink, 'https://reddit.com')

          void open(url.toString())
        }

        if (event.nativeEvent.actionKey === 'share') {
          const url = new URL(post.permalink, 'https://reddit.com')

          void Share.share({
            message: post.title,
            url: url.toString(),
          })
        }

        if (event.nativeEvent.actionKey === 'copyLink') {
          const url = new URL(post.permalink, 'https://reddit.com')

          void copy(url.toString())
        }

        if (event.nativeEvent.actionKey === 'hidePost') {
          hide({
            action: post.hidden ? 'unhide' : 'hide',
            id: post.id,
            type: 'post',
          })
        }

        if (event.nativeEvent.actionKey === 'hideUser') {
          hide({
            action: 'hide',
            id: post.user.id,
            type: 'user',
          })
        }

        if (event.nativeEvent.actionKey === 'hideCommunity') {
          hide({
            action: 'hide',
            id: post.community.id,
            type: 'community',
          })
        }

        if (reasons.includes(event.nativeEvent.actionKey as ReportReason)) {
          report({
            id: post.id,
            reason: event.nativeEvent.actionKey as ReportReason,
            type: 'post',
          })
        }
      }}
      onPressMenuPreview={() => {
        onPress()
      }}
      style={style}
    >
      {children}
    </ContextMenuView>
  )
}
