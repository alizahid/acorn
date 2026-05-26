import { usePathname, useRouter } from 'expo-router'
import { type ReactNode, type RefObject, useRef } from 'react'
import { Share, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { StyleSheet } from 'react-native-unistyles'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { useCopy } from '~/hooks/copy'
import {
  useCopyImage,
  useDownloadImage,
  useDownloadImages,
  useShareImage,
} from '~/hooks/image'
import { useLink } from '~/hooks/link'
import { useHide } from '~/hooks/moderation/hide'
import { type ReportReason, useReport } from '~/hooks/moderation/report'
import { usePostRemove } from '~/hooks/mutations/posts/remove'
import { usePostSave } from '~/hooks/mutations/posts/save'
import { usePostVote } from '~/hooks/mutations/posts/vote'
import { useDownloadVideo } from '~/hooks/video'
import { getIcon } from '~/lib/icons'
import { REDDIT_OLD_URI, REDDIT_URI } from '~/reddit/api'
import { useAuth } from '~/stores/auth'
import { usePreferences } from '~/stores/preferences'
import { type Post } from '~/types/post'

import { IconButton } from '../common/icon/button'
import { Logo } from '../common/logo'
import { Sheet } from '../common/sheet'

type Props = {
  ref: RefObject<Sheet | null>
  children: ReactNode
  post: Post
}

export function PostMenu({ ref, children, post }: Props) {
  const router = useRouter()

  const { accountId } = useAuth(['accountId'])
  const { oldReddit } = usePreferences(['oldReddit'])

  const t = useTranslations('component.posts.menu')
  const toasts = useTranslations('toasts')

  const reportRef = useRef<Sheet>(null)

  const { vote } = usePostVote()
  const { save } = usePostSave()
  const { report } = useReport()

  const { copy } = useCopy()
  const { hide } = useHide()
  const { handleLink, openInBrowser } = useLink()

  const { copy: copyImage } = useCopyImage()
  const { share: shareImage } = useShareImage()
  const { download: downloadImage } = useDownloadImage()
  const { download: downloadImages } = useDownloadImages()
  const { download: downloadVideo } = useDownloadVideo()

  return (
    <>
      {children}

      <Sheet.Root ref={ref} scrollable>
        <Sheet.Header style={styles.title} title={post.title} />

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.palette}>
            <IconButton
              color="orange"
              icon={getIcon(post.liked ? 'upvote.fill' : 'upvote')}
              label={t(post.liked ? 'removeUpvote' : 'upvote')}
              onPress={() => {
                ref.current?.dismiss()

                vote({
                  direction: post.liked ? 0 : 1,
                  postId: post.id,
                })
              }}
            />

            <IconButton
              color="violet"
              icon={getIcon(
                post.liked === false ? 'downvote.fill' : 'downvote',
              )}
              label={t(post.liked === false ? 'removeDownvote' : 'downvote')}
              onPress={() => {
                ref.current?.dismiss()

                vote({
                  direction: post.liked === false ? 0 : -1,
                  postId: post.id,
                })
              }}
            />

            <IconButton
              color="green"
              icon={post.saved ? 'bookmark.fill' : 'bookmark'}
              label={t(post.saved ? 'unsave' : 'save')}
              onPress={() => {
                ref.current?.dismiss()

                save({
                  action: post.saved ? 'unsave' : 'save',
                  postId: post.id,
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
                    id: post.id,
                  },
                  pathname: '/posts/[id]/reply',
                })
              }}
            />
          </View>

          <Sheet.Separator />

          <Sheet.Subtitle title={t('section.post')} />

          <Sheet.Item
            label={t('copyTitle')}
            left={<Icon name="square.on.square" />}
            onPress={() => {
              ref.current?.dismiss()

              copy(post.title).then(() => {
                toast.success(t('toast.titleCopied'))
              })
            }}
          />

          {post.body?.length ? (
            <Sheet.Item
              label={t('copyText')}
              left={<Icon name="square.on.square" />}
              onPress={() => {
                ref.current?.dismiss()

                if (post.body) {
                  copy(post.body).then(() => {
                    toast.success(t('toast.textCopied'))
                  })
                }
              }}
            />
          ) : null}

          <Sheet.Item
            label={t('copyPermalink')}
            left={<Icon name="square.on.square" />}
            onPress={() => {
              ref.current?.dismiss()

              const url = new URL(
                post.permalink,
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
                post.permalink,
                oldReddit ? REDDIT_OLD_URI : REDDIT_URI,
              )

              Share.share({
                url: url.toString(),
              })
            }}
          />

          <Sheet.Item
            label={t('openApp')}
            left={<Logo size={24} />}
            onPress={() => {
              ref.current?.dismiss()

              handleLink(post.permalink)
            }}
          />

          <Sheet.Item
            label={t('openBrowser')}
            left={<Icon name="safari" />}
            onPress={() => {
              ref.current?.dismiss()

              const url = new URL(
                post.permalink,
                oldReddit ? REDDIT_OLD_URI : REDDIT_URI,
              )

              openInBrowser(url.toString())
            }}
          />

          {post.type === 'link' && post.url ? (
            <>
              <Sheet.Separator />

              <Sheet.Subtitle title={t('section.link')} />

              <Sheet.Item
                label={t('openLink')}
                left={<Icon name="safari" />}
                onPress={() => {
                  ref.current?.dismiss()

                  if (post.url) {
                    handleLink(post.url)
                  }
                }}
              />

              <Sheet.Item
                label={t('copyLink')}
                left={<Icon name="square.on.square" />}
                onPress={() => {
                  ref.current?.dismiss()

                  if (post.url) {
                    copy(post.url).then(() => {
                      toast.success(toasts('link.copied'))
                    })
                  }
                }}
              />

              <Sheet.Item
                label={t('shareLink')}
                left={<Icon name="square.and.arrow.up" />}
                onPress={() => {
                  ref.current?.dismiss()

                  if (post.url) {
                    Share.share({
                      url: post.url,
                    })
                  }
                }}
              />
            </>
          ) : null}

          {post.type === 'image' ? (
            <>
              <Sheet.Separator />

              <Sheet.Subtitle
                title={t(
                  (post.media.images?.length ?? 0) > 1
                    ? 'section.gallery'
                    : 'section.image',
                )}
              />

              {(post.media.images?.length ?? 0) === 1 ? (
                <Sheet.Item
                  label={t('copyImage')}
                  left={<Icon name="square.on.square" />}
                  onPress={() => {
                    ref.current?.dismiss()

                    if (post.media.images?.[0]?.url) {
                      copyImage({
                        url: post.media.images[0]?.url,
                      })
                    }
                  }}
                />
              ) : null}

              {(post.media.images?.length ?? 0) === 1 ? (
                <Sheet.Item
                  label={t('shareImage')}
                  left={<Icon name="square.and.arrow.up" />}
                  onPress={() => {
                    ref.current?.dismiss()

                    if (post.media.images?.[0]?.url) {
                      shareImage({
                        url: post.media.images[0]?.url,
                      })
                    }
                  }}
                />
              ) : null}

              {(post.media.images?.length ?? 0) === 1 ? (
                <Sheet.Item
                  label={t('downloadImage')}
                  left={<Icon name="square.and.arrow.down" />}
                  onPress={() => {
                    ref.current?.dismiss()

                    if (post.media.images?.[0]?.url) {
                      downloadImage({
                        url: post.media.images[0]?.url,
                      })
                    }
                  }}
                />
              ) : null}

              {(post.media.images?.length ?? 0) > 1 ? (
                <Sheet.Item
                  label={t('downloadGallery')}
                  left={<Icon name="square.and.arrow.down" />}
                  onPress={() => {
                    ref.current?.dismiss()

                    if (post.media.images?.length) {
                      downloadImages({
                        urls: post.media.images.map((image) => image.url),
                      })
                    }
                  }}
                />
              ) : null}
            </>
          ) : null}

          {post.type === 'video' ? (
            <>
              <Sheet.Separator />

              <Sheet.Subtitle title={t('section.video')} />

              {post.media.video ? (
                <Sheet.Item
                  label={t('downloadVideo')}
                  left={<Icon name="square.on.square" />}
                  onPress={() => {
                    ref.current?.dismiss()

                    console.log('post.media.video', post.media.video)

                    if (post.media.video) {
                      downloadVideo({
                        provider: post.media.video?.provider,
                        url: post.media.video?.url,
                      })
                    }
                  }}
                />
              ) : null}
            </>
          ) : null}

          <Sheet.Separator />

          <Sheet.Subtitle title={t('section.navigation')} />

          <Sheet.Item
            label={t('openUser', {
              user: post.user.name,
            })}
            left={<Icon name="person" />}
            onPress={() => {
              ref.current?.dismiss()

              router.navigate({
                params: {
                  name: post.user.name,
                },
                pathname: '/users/[name]',
              })
            }}
          />

          {post.community.name.startsWith('u/') ? null : (
            <Sheet.Item
              label={t('openCommunity', {
                community: post.community.name,
              })}
              left={<Icon name="person.2" />}
              onPress={() => {
                ref.current?.dismiss()

                router.navigate({
                  params: {
                    name: post.community.name,
                  },
                  pathname: '/communities/[name]',
                })
              }}
            />
          )}

          <Sheet.Separator />

          <Sheet.Subtitle title={t('section.actions')} />

          {post.user.name === accountId ? (
            <PostDeleteAction post={post} ref={ref} />
          ) : null}

          <Sheet.Confirm
            label={t(post.hidden ? 'unhidePost' : 'hidePost')}
            left={
              <Icon
                name={post.hidden ? 'eye' : 'eye.slash'}
                uniProps={(theme) => ({
                  tintColor: post.hidden
                    ? theme.colors.accent.accent
                    : theme.colors.red.accent,
                })}
              />
            }
            onPress={() => {
              ref.current?.dismiss()

              hide({
                action: post.hidden ? 'unhide' : 'hide',
                id: post.id,
                type: 'post',
              })
            }}
          />

          <Sheet.Confirm
            label={t('hideUser', {
              user: post.user.name,
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

              if (post.user.id) {
                hide({
                  action: 'hide',
                  id: post.user.id,
                  name: post.user.name,
                  type: 'user',
                })
              }
            }}
          />

          {post.community.name.startsWith('u/') ? null : (
            <Sheet.Confirm
              label={t('hideCommunity', {
                community: post.community.name,
              })}
              left={
                <Icon
                  name="person.2"
                  uniProps={(theme) => ({
                    tintColor: theme.colors.red.accent,
                  })}
                />
              }
              onPress={() => {
                ref.current?.dismiss()

                hide({
                  action: 'hide',
                  id: post.community.id,
                  name: post.community.name,
                  type: 'community',
                })
              }}
            />
          )}

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
            {reasons
              .filter((reason) =>
                reason === 'community'
                  ? !post.community.name.startsWith('u/')
                  : true,
              )
              .map((item) => (
                <Sheet.Confirm
                  key={item}
                  label={t(`report.${item}`, {
                    community: post.community.name,
                  })}
                  onPress={() => {
                    report({
                      id: post.id,
                      reason: item,
                      type: 'post',
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

function PostDeleteAction({ ref, post }: Pick<Props, 'ref' | 'post'>) {
  const router = useRouter()
  const path = usePathname()

  const t = useTranslations('component.posts.menu')

  const { remove } = usePostRemove()

  return (
    <Sheet.Confirm
      label={t('deletePost')}
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
          id: post.id,
        })

        if (path.startsWith('/posts/')) {
          router.back()
        }
      }}
    />
  )
}

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

const styles = StyleSheet.create((theme, runtime) => ({
  confirm: {
    flexDirection: 'row',
  },
  content: {
    paddingBottom: theme.space[4] + runtime.insets.bottom,
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
