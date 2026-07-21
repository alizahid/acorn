import { usePathname, useRouter } from 'expo-router'
import { onTranslateSheet } from 'expo-translate-text'
import { type ReactNode, type RefObject, useRef } from 'react'
import { Share, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { StyleSheet } from 'react-native-unistyles'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'
import { useShallow } from 'zustand/react/shallow'

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
import { useScreenshot } from '~/hooks/screenshot'
import { useDownloadVideo } from '~/hooks/video'
import { REDDIT_OLD_URI, REDDIT_URI } from '~/reddit/api'
import { useAuth } from '~/stores/auth'
import { usePreferences } from '~/stores/preferences'
import { type Post } from '~/types/post'

import { IconButton } from '../common/icon/button'
import { Logo } from '../common/logo'
import { Sheet } from '../common/sheet'

type Props = {
  ref: RefObject<Sheet | null>
  card?: RefObject<View | null>
  children: ReactNode
  post: Post
  onCapturing?: (capturing: boolean) => void
}

export function PostMenu({ ref, card, children, post, onCapturing }: Props) {
  const router = useRouter()

  const { accountId } = useAuth(
    useShallow((state) => ({
      accountId: state.accountId,
    })),
  )

  const { oldReddit } = usePreferences(
    useShallow((state) => ({
      oldReddit: state.oldReddit,
    })),
  )

  const t = useTranslations('component.posts.menu')

  const reportRef = useRef<Sheet>(null)

  const { screenshot } = useScreenshot({
    onCapturing,
  })

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
              accessibilityLabel={t(post.liked ? 'removeUpvote' : 'upvote')}
              onPress={() => {
                ref.current?.dismiss()

                vote({
                  direction: post.liked ? 0 : 1,
                  postId: post.id,
                })
              }}
            >
              <Icon
                name={post.liked ? 'arrow-fat-up-fill' : 'arrow-fat-up'}
                uniProps={(theme) => ({
                  color: theme.colors.orange.accent,
                })}
              />
            </IconButton>

            <IconButton
              accessibilityLabel={t(
                post.liked === false ? 'removeDownvote' : 'downvote',
              )}
              onPress={() => {
                ref.current?.dismiss()

                vote({
                  direction: post.liked === false ? 0 : -1,
                  postId: post.id,
                })
              }}
            >
              <Icon
                name={
                  post.liked === false
                    ? 'arrow-fat-down-fill'
                    : 'arrow-fat-down'
                }
                uniProps={(theme) => ({
                  color: theme.colors.violet.accent,
                })}
              />
            </IconButton>

            <IconButton
              accessibilityLabel={t(post.saved ? 'unsave' : 'save')}
              onPress={() => {
                ref.current?.dismiss()

                save({
                  action: post.saved ? 'unsave' : 'save',
                  postId: post.id,
                })
              }}
            >
              <Icon
                name={post.saved ? 'bookmark-simple-fill' : 'bookmark-simple'}
                uniProps={(theme) => ({
                  color: theme.colors.green.accent,
                })}
              />
            </IconButton>

            <IconButton
              accessibilityLabel={t('reply')}
              onPress={() => {
                ref.current?.dismiss()

                router.navigate({
                  params: {
                    id: post.id,
                  },
                  pathname: '/posts/[id]/reply',
                })
              }}
            >
              <Icon
                name="arrow-bend-up-left-bold"
                uniProps={(theme) => ({
                  color: theme.colors.blue.accent,
                })}
              />
            </IconButton>
          </View>

          <Sheet.Separator />

          <Sheet.Subtitle title={t('section.post')} />

          <Sheet.Item
            label={t('copyTitle')}
            left={<Icon name="copy" />}
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
              left={<Icon name="copy" />}
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

          {post.body?.length ? (
            <Sheet.Item
              label={t('translateText')}
              left={<Icon name="translate" />}
              onPress={() => {
                ref.current?.dismiss()

                if (post.body) {
                  onTranslateSheet({
                    input: post.body,
                  })
                }
              }}
            />
          ) : null}

          <Sheet.Item
            label={t('copyPermalink')}
            left={<Icon name="copy" />}
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
            left={<Icon name="export" />}
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
            left={<Logo style={styles.logo} />}
            onPress={() => {
              ref.current?.dismiss()

              handleLink(post.permalink)
            }}
          />

          <Sheet.Item
            label={t('openBrowser')}
            left={<Icon name="compass" />}
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
                left={<Icon name="compass" />}
                onPress={() => {
                  ref.current?.dismiss()

                  if (post.url) {
                    handleLink(post.url)
                  }
                }}
              />

              <Sheet.Item
                label={t('copyLink')}
                left={<Icon name="copy" />}
                onPress={() => {
                  ref.current?.dismiss()

                  if (post.url) {
                    copy(post.url).then(() => {
                      toast.success(t('toast.linkCopied'))
                    })
                  }
                }}
              />

              <Sheet.Item
                label={t('shareLink')}
                left={<Icon name="export" />}
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

          {post.type === 'image' && post.media.images ? (
            <>
              <Sheet.Separator />

              <Sheet.Subtitle
                title={t(
                  post.media.images.length > 1
                    ? 'section.gallery'
                    : 'section.image',
                )}
              />

              {post.media.images.length === 1 ? (
                <Sheet.Item
                  label={t('copyImage')}
                  left={<Icon name="copy" />}
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

              {post.media.images.length === 1 ? (
                <Sheet.Item
                  label={t('shareImage')}
                  left={<Icon name="export" />}
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

              {post.media.images.length === 1 ? (
                <Sheet.Item
                  label={t('downloadImage')}
                  left={<Icon name="download" />}
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

              {post.media.images.length > 1 ? (
                <Sheet.Item
                  label={t('downloadGallery')}
                  left={<Icon name="download" />}
                  onPress={() => {
                    ref.current?.dismiss()

                    if (post.media.images) {
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
                  left={<Icon name="download" />}
                  onPress={() => {
                    ref.current?.dismiss()

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

          {card ? (
            <>
              <Sheet.Separator />

              <Sheet.Subtitle title={t('section.screenshot')} />

              <Sheet.Item
                label={t('copyScreenshot')}
                left={<Icon name="copy" />}
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
                left={<Icon name="export" />}
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
                left={<Icon name="download" />}
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
              user: post.user.name,
            })}
            left={<Icon name="user" />}
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
              left={<Icon name="users-four" />}
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
                name={post.hidden ? 'eye' : 'eye-slash'}
                uniProps={(theme) => ({
                  color: post.hidden
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
                name="user"
                uniProps={(theme) => ({
                  color: theme.colors.red.accent,
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
                  name="users-four"
                  uniProps={(theme) => ({
                    color: theme.colors.red.accent,
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
                  color: theme.colors.red.accent,
                })}
              />
            }
            onPress={() => {
              reportRef.current?.present()
            }}
            right={
              <Icon
                name="caret-right"
                uniProps={(theme) => ({
                  color: theme.colors.gray.accent,
                  size: theme.space[4],
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
            color: theme.colors.red.accent,
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
