import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from 'expo-router'
import { useCallback, useRef, useState } from 'react'
import {
  type EditorStyleState,
  type MarkdownEditorHandle,
} from 'react-native-fast-markdown'
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { IconButton } from '~/components/common/icon/button'
import { MarkdownEditor } from '~/components/markdown/editor'
import { useCommentEdit } from '~/hooks/mutations/comments/edit'
import { usePostReply } from '~/hooks/mutations/posts/reply'
import { useShallow } from 'zustand/react/shallow'

import { type Font, fonts } from '~/lib/fonts'
import { usePreferences } from '~/stores/preferences'

const schema = z.object({
  body: z.string().optional(),
  commentId: z.string().optional(),
  id: z.string().catch('17jkixh'),
  postId: z.string().optional(),
  user: z.string().optional(),
})

export default function Screen() {
  const router = useRouter()
  const navigation = useNavigation()

  const params = schema.parse(useLocalSearchParams())

  const { font, fontScaling } = usePreferences(
    useShallow((s) => ({
      font: s.font,
      fontScaling: s.fontScaling,
    })),
  )

  const t = useTranslations('screen.posts.reply')
  const a11y = useTranslations('a11y')

  const { height } = useReanimatedKeyboardAnimation()

  const reply = usePostReply()
  const edit = useCommentEdit()

  const editor = useRef<MarkdownEditorHandle>(null)

  const [state, setState] = useState<EditorStyleState>()
  const [text, setText] = useState(params.body)

  const style = useAnimatedStyle(() => ({
    paddingBottom: height.get(),
  }))

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerRight: () => (
          <IconButton
            icon="paperplane.fill"
            label={a11y('createComment')}
            loading={reply.isPending || edit.isPending}
            onPress={async () => {
              if (!text) {
                return
              }

              if (params.body && params.commentId) {
                if (params.body !== text) {
                  await edit.edit({
                    body: text,
                    id: params.commentId,
                    postId: params.postId,
                  })
                }

                router.back()

                return
              }

              await reply.reply({
                commentId: params.commentId,
                postId: params.id,
                text,
              })

              router.back()
            }}
            size="6"
          />
        ),
        title: params.user
          ? t('user', {
              user: params.user,
            })
          : params.commentId
            ? t('editing')
            : t('title'),
      })
    }, [a11y, edit, navigation, params, reply, router, text, t]),
  )

  return (
    <Animated.View style={[styles.main, style]}>
      <MarkdownEditor.ToolBar
        editor={editor}
        state={state}
        style={styles.toolBar}
      />

      <MarkdownEditor.Root
        onChange={setText}
        onChangeState={setState}
        placeholder={t('placeholder')}
        ref={editor}
        style={styles.input(font, fontScaling)}
        value={text}
      />
    </Animated.View>
  )
}

const styles = StyleSheet.create((theme) => ({
  input: (font: Font, scaling: number) => ({
    color: theme.colors.gray.text,
    flex: 1,
    fontFamily: fonts[font],
    fontSize: theme.typography[3].fontSize * scaling,
    lineHeight: theme.typography[3].lineHeight * scaling,
    padding: theme.space[4],
  }),
  main: {
    flex: 1,
  },
  toolBar: {
    backgroundColor: theme.colors.gray.ui,
  },
}))
