import { type BottomSheetModal } from '@gorhom/bottom-sheet'
import { usePathname, useRouter } from 'expo-router'
import { useEffect, useRef } from 'react'
import { createCallable } from 'react-call'
import { Alert, Share } from 'react-native'
import { useStyles } from 'react-native-unistyles'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'

import { Logo } from '~/components/common/logo'
import { View } from '~/components/common/view'
import { SheetItem } from '~/components/sheets/item'
import { SheetModal } from '~/components/sheets/modal'
import { useCopy } from '~/hooks/copy'
import {
  useCopyImage,
  useDownloadImage,
  useDownloadImages,
} from '~/hooks/image'
import { useLink } from '~/hooks/link'
import { useHide } from '~/hooks/moderation/hide'
import { type ReportReason, useReport } from '~/hooks/moderation/report'
import { usePostRemove } from '~/hooks/mutations/posts/remove'
import { usePostSave } from '~/hooks/mutations/posts/save'
import { usePostVote } from '~/hooks/mutations/posts/vote'
import { useAuth } from '~/stores/auth'
import { usePreferences } from '~/stores/preferences'
import { type Post } from '~/types/post'

type Props = {
  post: Post
}

export const PostMenu = createCallable<Props>(({ call, post }) => {
  const router = useRouter()
  const path = usePathname()

  const { accountId } = useAuth()
  const { oldReddit } = usePreferences()

  const t = useTranslations('component.posts.menu')

  const { theme } = useStyles()

  const sheet = useRef<BottomSheetModal>(null)
  const sheetReport = useRef<BottomSheetModal>(null)

  const { vote } = usePostVote()
  const { save } = usePostSave()
  const { report } = useReport()
  const { remove } = usePostRemove()

  const { copy } = useCopy()
  const { hide } = useHide()
  const { handleLink, openInBrowser } = useLink()
  const { copy: copyImage } = useCopyImage()
  const { download: downloadImage } = useDownloadImage()
  const { download: downloadAll } = useDownloadImages()

  useEffect(() => {
    sheet.current?.present()
  }, [])

  useEffect(() => {
    if (call.ended) {
      sheet.current?.close()
    }
  }, [call.ended])

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
    <>
      <SheetModal
        container="scroll"
        onClose={() => {
          call.end()
        }}
        ref={sheet}
        title={t('title.post')}
      >
        <SheetItem
          icon={{
            color: theme.colors.orange.accent,
            name: 'ArrowFatUp',
            type: 'icon',
          }}
          label={t(post.liked ? 'removeUpvote' : 'upvote')}
          onPress={() => {
            vote({
              direction: post.liked ? 0 : 1,
              postId: post.id,
            })

            call.end()
          }}
        />

        <SheetItem
          icon={{
            color: theme.colors.violet.accent,
            name: 'ArrowFatDown',
            type: 'icon',
          }}
          label={t(post.liked === false ? 'removeDownvote' : 'downvote')}
          onPress={() => {
            vote({
              direction: post.liked === false ? 0 : -1,
              postId: post.id,
            })

            call.end()
          }}
        />

        <SheetItem
          icon={{
            color: theme.colors.green.accent,
            name: 'BookmarkSimple',
            type: 'icon',
          }}
          label={t(post.saved ? 'unsave' : 'save')}
          onPress={() => {
            save({
              action: post.saved ? 'unsave' : 'save',
              postId: post.id,
            })

            call.end()
          }}
        />

        <SheetItem
          icon={{
            color: theme.colors.blue.accent,
            name: 'ArrowBendUpLeft',
            type: 'icon',
          }}
          label={t('reply')}
          onPress={() => {
            router.push({
              params: {
                id: post.id,
              },
              pathname: '/posts/[id]/reply',
            })

            call.end()
          }}
        />

        {post.user.name === accountId ? (
          <>
            <View height="4" />

            <SheetItem
              icon={{
                color: theme.colors.red.accent,
                name: 'Trash',
                type: 'icon',
              }}
              label={t('deletePost.title')}
              onPress={() => {
                Alert.alert(
                  t('deletePost.title'),
                  t('deleteComment.description'),
                  [
                    {
                      style: 'cancel',
                      text: t('deletePost.no'),
                    },
                    {
                      onPress() {
                        remove({
                          id: post.id,
                        })

                        if (path.startsWith('/posts/')) {
                          router.back()
                        }

                        call.end()
                      },
                      style: 'destructive',
                      text: t('deletePost.yes'),
                    },
                  ],
                )
              }}
            />
          </>
        ) : null}

        <View height="4" />

        <SheetItem
          icon={{
            color: theme.colors.gray.textLow,
            name: 'Copy',
            type: 'icon',
          }}
          label={t('copyTitle')}
          onPress={() => {
            void copy(post.title).then(() => {
              toast.success(t('toast.titleCopied'))
            })

            call.end()
          }}
        />

        {post.body?.length ? (
          <SheetItem
            icon={{
              color: theme.colors.gray.textLow,
              name: 'Copy',
              type: 'icon',
            }}
            label={t('copyText')}
            onPress={() => {
              if (post.body) {
                void copy(post.body).then(() => {
                  toast.success(t('toast.textCopied'))
                })
              }

              call.end()
            }}
          />
        ) : null}

        <SheetItem
          icon={{
            color: theme.colors.gray.textLow,
            name: 'Copy',
            type: 'icon',
          }}
          label={t('copyPermalink')}
          onPress={() => {
            const url = new URL(
              post.permalink,
              oldReddit ? 'https://old.reddit.com' : 'https://reddit.com',
            )

            void copy(url.toString()).then(() => {
              toast.success(t('toast.linkCopied'))
            })

            call.end()
          }}
        />

        <SheetItem
          icon={{
            color: theme.colors.gray.textLow,
            name: 'Share',
            type: 'icon',
          }}
          label={t('sharePermalink')}
          onPress={() => {
            const url = new URL(
              post.permalink,
              oldReddit ? 'https://old.reddit.com' : 'https://reddit.com',
            )

            void Share.share({
              url: url.toString(),
            })

            call.end()
          }}
        />

        {post.media.images ? (
          <>
            <View height="4" />

            {post.type === 'image' && post.media.images[0] ? (
              <SheetItem
                icon={{
                  color: theme.colors.gray.textLow,
                  name: 'Copy',
                  type: 'icon',
                }}
                label={t('copyImage')}
                onPress={() => {
                  if (!post.media.images?.[0]?.url) {
                    call.end()

                    return
                  }

                  copyImage({
                    url: post.media.images[0].url,
                  })

                  call.end()
                }}
              />
            ) : null}

            {post.type === 'image' && post.media.images[0] ? (
              <SheetItem
                icon={{
                  color: theme.colors.gray.textLow,
                  name: 'Download',
                  type: 'icon',
                }}
                label={t('downloadImage')}
                onPress={() => {
                  if (!post.media.images?.[0]?.url) {
                    call.end()

                    return
                  }

                  downloadImage({
                    url: post.media.images[0].url,
                  })

                  call.end()
                }}
              />
            ) : null}

            {post.type === 'image' && post.media.images.length > 1 ? (
              <SheetItem
                icon={{
                  color: theme.colors.gray.textLow,
                  name: 'BoxArrowDown',
                  type: 'icon',
                }}
                label={t('downloadGallery')}
                onPress={() => {
                  if (!post.media.images?.[0]?.url) {
                    call.end()

                    return
                  }

                  downloadAll({
                    urls: post.media.images.map((image) => image.url),
                  })

                  call.end()
                }}
              />
            ) : null}
          </>
        ) : null}

        <View height="4" />

        <SheetItem
          label={t('openApp')}
          left={<Logo size={theme.space[5]} />}
          onPress={() => {
            void handleLink(post.permalink)

            call.end()
          }}
        />

        <SheetItem
          icon={{
            color: theme.colors.gray.textLow,
            name: 'Compass',
            type: 'icon',
          }}
          label={t('openBrowser')}
          onPress={() => {
            const url = new URL(
              post.permalink,
              oldReddit ? 'https://old.reddit.com' : 'https://reddit.com',
            )

            openInBrowser(url.toString())

            call.end()
          }}
        />

        <SheetItem
          icon={{
            color: theme.colors.gray.textLow,
            name: 'User',
            type: 'icon',
          }}
          label={t('openUser', {
            user: post.user.name,
          })}
          onPress={() => {
            router.push({
              params: {
                name: post.user.name,
              },
              pathname: '/users/[name]',
            })

            call.end()
          }}
        />

        {!post.community.name.startsWith('u/') ? (
          <SheetItem
            icon={{
              color: theme.colors.gray.textLow,
              name: 'UsersFour',
              type: 'icon',
            }}
            label={t('openCommunity', {
              community: post.community.name,
            })}
            onPress={() => {
              router.push({
                params: {
                  name: post.community.name,
                },
                pathname: '/communities/[name]',
              })

              call.end()
            }}
          />
        ) : null}

        <View height="4" />

        <SheetItem
          icon={{
            color: theme.colors.red.accent,
            name: 'EyeClosed',
            type: 'icon',
          }}
          label={t('hidePost')}
          onPress={() => {
            hide({
              action: post.hidden ? 'unhide' : 'hide',
              id: post.id,
              type: 'post',
            })

            call.end()
          }}
        />

        <SheetItem
          icon={{
            color: theme.colors.red.accent,
            name: 'User',
            type: 'icon',
          }}
          label={t('hideUser', {
            user: post.user.name,
          })}
          onPress={() => {
            if (post.user.id) {
              hide({
                action: 'hide',
                id: post.user.id,
                name: post.user.name,
                type: 'user',
              })
            }

            call.end()
          }}
        />

        {!post.community.name.startsWith('u/') ? (
          <SheetItem
            icon={{
              color: theme.colors.red.accent,
              name: 'UsersFour',
              type: 'icon',
            }}
            label={t('hideCommunity', {
              community: post.community.name,
            })}
            onPress={() => {
              hide({
                action: 'hide',
                id: post.community.id,
                name: post.community.name,
                type: 'community',
              })

              call.end()
            }}
          />
        ) : null}

        <SheetItem
          icon={{
            color: theme.colors.red.accent,
            name: 'Flag',
            type: 'icon',
          }}
          label={t('report.title')}
          navigate
          onPress={() => {
            sheetReport.current?.present()
          }}
        />
      </SheetModal>

      <SheetModal
        container="scroll"
        ref={sheetReport}
        title={t('report.title')}
      >
        {reasons
          .filter((reason) =>
            reason === 'community'
              ? !post.community.name.startsWith('u/')
              : true,
          )
          .map((item) => (
            <SheetItem
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

                sheetReport.current?.close()

                call.end()
              }}
            />
          ))}
      </SheetModal>
    </>
  )
}, 250)
