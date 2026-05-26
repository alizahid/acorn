import { useRouter } from 'expo-router'
import { onTranslateSheet } from 'expo-translate-text'
import { type ReactNode, type RefObject, useRef } from 'react'
import { Share, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { StyleSheet } from 'react-native-unistyles'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { IconButton } from '~/components/common/icon/button'
import { Logo } from '~/components/common/logo'
import { Sheet } from '~/components/common/sheet'
import { useCopy } from '~/hooks/copy'
import { useCopyImage, useDownloadImage, useShareImage } from '~/hooks/image'
import { useLink } from '~/hooks/link'
import { useHide } from '~/hooks/moderation/hide'
import { type ReportReason, useReport } from '~/hooks/moderation/report'
import { useCommentRemove } from '~/hooks/mutations/comments/remove'
import { useCommentSave } from '~/hooks/mutations/comments/save'
import { useCommentVote } from '~/hooks/mutations/comments/vote'
import { useScreenshot } from '~/hooks/screenshot'
import { getIcon } from '~/lib/icons'
import { REDDIT_OLD_URI, REDDIT_URI } from '~/reddit/api'
import { useAuth } from '~/stores/auth'
import { usePreferences } from '~/stores/preferences'
import { type CommentReply } from '~/types/comment'

import { GestureIcons } from '../common/gestures/actions'

type Props = {
  ref: RefObject<Sheet | null>
  card?: RefObject<View | null>
  children: ReactNode
  comment: CommentReply
  onCollapse?: () => void
  onCollapseThread?: () => void
  onCapturing?: (capturing: boolean) => void
}

export function CommentMenu({
  ref,
  card,
  children,
  comment,
  onCollapse,
  onCollapseThread,
  onCapturing,
}: Props) {
  const router = useRouter()

  const { accountId } = useAuth(['accountId'])
  const { oldReddit } = usePreferences(['oldReddit'])

  const t = useTranslations('component.posts.menu')

  const reportRef = useRef<Sheet>(null)

  const { screenshot } = useScreenshot({
    onCapturing,
  })

  const { vote } = useCommentVote()
  const { save } = useCommentSave()
  const { remove } = useCommentRemove()
  const { report } = useReport()

  const { copy } = useCopy()
  const { hide } = useHide()
  const { handleLink, openInBrowser } = useLink()

  const { copy: copyImage } = useCopyImage()
  const { share: shareImage } = useShareImage()
  const { download: downloadImage } = useDownloadImage()

  return (
    <>
      {children}

      <Sheet.Root ref={ref} scrollable>
        <Sheet.Header
          style={styles.title}
          title={
            comment.body.startsWith('http')
              ? t('section.comment')
              : comment.body
          }
        />

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.palette}>
            <IconButton
              color="orange"
              icon={getIcon(comment.liked ? 'upvote.fill' : 'upvote')}
              label={t(comment.liked ? 'removeUpvote' : 'upvote')}
              onPress={() => {
                ref.current?.dismiss()

                vote({
                  commentId: comment.id,
                  direction: comment.liked ? 0 : 1,
                  postId: comment.post.id,
                })
              }}
            />

            <IconButton
              color="violet"
              icon={getIcon(
                comment.liked === false ? 'downvote.fill' : 'downvote',
              )}
              label={t(comment.liked === false ? 'removeDownvote' : 'downvote')}
              onPress={() => {
                ref.current?.dismiss()

                vote({
                  commentId: comment.id,
                  direction: comment.liked === false ? 0 : -1,
                  postId: comment.post.id,
                })
              }}
            />

            <IconButton
              color="green"
              icon={comment.saved ? 'bookmark.fill' : 'bookmark'}
              label={t(comment.saved ? 'unsave' : 'save')}
              onPress={() => {
                ref.current?.dismiss()

                save({
                  action: comment.saved ? 'unsave' : 'save',
                  commentId: comment.id,
                  postId: comment.post.id,
                })
              }}
            />

            <IconButton
              color="blue"
              icon="arrowshape.turn.up.backward"
              label={t('reply')}
              onPress={() => {
                ref.current?.dismiss()

                router.navigate({
                  params: {
                    commentId: comment.id,
                    id: comment.post.id,
                    user: comment.user.name,
                  },
                  pathname: '/posts/[id]/reply',
                })
              }}
            />
          </View>

          <Sheet.Separator />

          <Sheet.Subtitle title={t('section.comment')} />

          {onCollapse ? (
            <Sheet.Item
              label={t('collapseComment')}
              left={<Icon name={GestureIcons.collapse} />}
              onPress={() => {
                ref.current?.dismiss()

                onCollapse()
              }}
            />
          ) : null}

          {onCollapseThread ? (
            <Sheet.Item
              label={t('collapseThread')}
              left={<Icon name={GestureIcons.collapseThread} />}
              onPress={() => {
                ref.current?.dismiss()

                onCollapseThread()
              }}
            />
          ) : null}

          <Sheet.Item
            label={t('copyText')}
            left={<Icon name="square.on.square" />}
            onPress={() => {
              ref.current?.dismiss()

              copy(comment.body).then(() => {
                toast.success(t('toast.textCopied'))
              })
            }}
          />

          <Sheet.Item
            label={t('translateText')}
            left={<Icon name="translate" />}
            onPress={() => {
              ref.current?.dismiss()

              onTranslateSheet({
                input: comment.body,
              })
            }}
          />

          <Sheet.Item
            label={t('copyPermalink')}
            left={<Icon name="square.on.square" />}
            onPress={() => {
              ref.current?.dismiss()

              const url = new URL(
                comment.permalink,
                oldReddit ? REDDIT_OLD_URI : REDDIT_URI,
              )

              copy(url.toString()).then(() => {
                toast.success(t('toast.linkCopied'))
              })
            }}
          />

          <Sheet.Item
            label={t('sharePermalink')}
            left={<Icon name="square.and.arrow.up" />}
            onPress={() => {
              ref.current?.dismiss()

              const url = new URL(
                comment.permalink,
                oldReddit ? REDDIT_OLD_URI : REDDIT_URI,
              )

              Share.share({
                url: url.toString(),
              })
            }}
          />

          <Sheet.Item
            label={t('openApp')}
            left={<Logo style={styles.logo} />}
            onPress={() => {
              ref.current?.dismiss()

              handleLink(comment.permalink)
            }}
          />

          <Sheet.Item
            label={t('openBrowser')}
            left={<Icon name="safari" />}
            onPress={() => {
              ref.current?.dismiss()

              const url = new URL(
                comment.permalink,
                oldReddit ? REDDIT_OLD_URI : REDDIT_URI,
              )

              openInBrowser(url.toString())
            }}
          />

          {card ? (
            <>
              <Sheet.Separator />

              <Sheet.Subtitle title={t('section.screenshot')} />

              <Sheet.Item
                label={t('copyScreenshot')}
                left={<Icon name="square.on.square" />}
                onPress={async () => {
                  const url = await screenshot(card)

                  ref.current?.dismiss()

                  copyImage({
                    url,
                  })
                }}
              />

              <Sheet.Item
                label={t('shareScreenshot')}
                left={<Icon name="square.and.arrow.up" />}
                onPress={async () => {
                  const url = await screenshot(card)

                  ref.current?.dismiss()

                  shareImage({
                    url,
                  })
                }}
              />

              <Sheet.Item
                label={t('downloadScreenshot')}
                left={<Icon name="square.and.arrow.down" />}
                onPress={async () => {
                  const url = await screenshot(card)

                  ref.current?.dismiss()

                  downloadImage({
                    url,
                  })
                }}
              />
            </>
          ) : null}

          <Sheet.Separator />

          <Sheet.Subtitle title={t('section.navigation')} />

          <Sheet.Item
            label={t('openUser', {
              user: comment.user.name,
            })}
            left={<Icon name="person" />}
            onPress={() => {
              ref.current?.dismiss()

              router.navigate({
                params: {
                  name: comment.user.name,
                },
                pathname: '/users/[name]',
              })
            }}
          />

          {comment.community.name.startsWith('u_') ? null : (
            <Sheet.Item
              label={t('openCommunity', {
                community: comment.community.name,
              })}
              left={<Icon name="person.2" />}
              onPress={() => {
                ref.current?.dismiss()

                router.navigate({
                  params: {
                    name: comment.community.name,
                  },
                  pathname: '/communities/[name]',
                })
              }}
            />
          )}

          <Sheet.Separator />

          <Sheet.Subtitle title={t('section.actions')} />

          {comment.user.name === accountId ? (
            <>
              <Sheet.Item
                label={t('editComment')}
                left={<Icon name="square.and.pencil" />}
                onPress={() => {
                  ref.current?.dismiss()

                  router.navigate({
                    params: {
                      body: comment.body,
                      commentId: comment.id,
                      id: comment.post.id,
                    },
                    pathname: '/posts/[id]/reply',
                  })
                }}
              />

              <Sheet.Confirm
                label={t('deleteComment')}
                left={
                  <Icon
                    name="trash"
                    uniProps={(theme) => ({
                      tintColor: theme.colors.red.accent,
                    })}
                  />
                }
                onPress={() => {
                  ref.current?.dismiss()

                  remove({
                    id: comment.id,
                    postId: comment.post.id,
                  })
                }}
              />
            </>
          ) : null}

          <Sheet.Confirm
            label={t('hideComment')}
            left={
              <Icon
                name="eye.slash"
                uniProps={(theme) => ({
                  tintColor: theme.colors.red.accent,
                })}
              />
            }
            onPress={() => {
              ref.current?.dismiss()

              hide({
                action: 'hide',
                id: comment.id,
                postId: comment.post.id,
                type: 'comment',
              })
            }}
          />

          <Sheet.Confirm
            label={t('hideUser', {
              user: comment.user.name,
            })}
            left={
              <Icon
                name="person"
                uniProps={(theme) => ({
                  tintColor: theme.colors.red.accent,
                })}
              />
            }
            onPress={() => {
              ref.current?.dismiss()

              if (comment.user.id) {
                hide({
                  action: 'hide',
                  id: comment.user.id,
                  name: comment.user.name,
                  type: 'user',
                })
              }
            }}
          />

          <Sheet.Item
            label={t('report.title')}
            left={
              <Icon
                name="flag"
                uniProps={(theme) => ({
                  tintColor: theme.colors.red.accent,
                })}
              />
            }
            onPress={() => {
              reportRef.current?.present()
            }}
            right={
              <Icon
                name="chevron.right"
                uniProps={(theme) => ({
                  size: theme.space[4],
                  tintColor: theme.colors.gray.accent,
                })}
              />
            }
          />
        </ScrollView>

        <Sheet.BottomInset />

        <Sheet.Root ref={reportRef} scrollable>
          <Sheet.Header style={styles.title} title={t('report.title')} />

          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {reasons.map((item) => (
              <Sheet.Confirm
                key={item}
                label={t(`report.${item}`, {
                  community: comment.community.name,
                })}
                onPress={() => {
                  report({
                    id: comment.id,
                    postId: comment.post.id,
                    reason: item,
                    type: 'comment',
                  })

                  reportRef.current?.dismiss()
                  ref.current?.dismiss()
                }}
              />
            ))}
          </ScrollView>

          <Sheet.BottomInset />
        </Sheet.Root>
      </Sheet.Root>
    </>
  )
}

const reasons: Array<ReportReason> = [
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

const styles = StyleSheet.create((theme, runtime) => ({
  content: {
    paddingBottom: theme.space[4] + runtime.insets.bottom,
  },
  logo: {
    height: theme.space[5],
    width: theme.space[5],
  },
  palette: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  title: {
    marginHorizontal: theme.space[4],
    marginTop: theme.space[2],
  },
}))
