import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from 'expo-router'
import { useCallback, useRef, useState } from 'react'
import { View } from 'react-native'
import {
  type EnrichedMarkdownTextInputInstance,
  type StyleState,
} from 'react-native-enriched-markdown'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { Icon } from '~/components/common/icon'
import { IconButton } from '~/components/common/icon/button'
import { Spinner } from '~/components/common/spinner'
import { MarkdownEditor } from '~/components/markdown/editor'
import { useCommentEdit } from '~/hooks/mutations/comments/edit'
import { usePostReply } from '~/hooks/mutations/posts/reply'
import { heights } from '~/lib/common'

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

  const t = useTranslations('screen.posts.reply')
  const a11y = useTranslations('a11y')

  const reply = usePostReply()
  const edit = useCommentEdit()

  const editor = useRef<EnrichedMarkdownTextInputInstance>(null)

  const [state, setState] = useState<StyleState>()
  const [text, setText] = useState(params.body)

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerRight: () => (
          <IconButton
            disabled={reply.isPending || edit.isPending}
            label={a11y('createComment')}
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
          >
            {reply.isPending || edit.isPending ? (
              <Spinner />
            ) : (
              <Icon name="paper-plane-tilt-fill" />
            )}
          </IconButton>
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
    <KeyboardAvoidingView
      behavior="translate-with-padding"
      keyboardVerticalOffset={heights.header}
      style={styles.main}
    >
      <MarkdownEditor.ToolBar
        editor={editor}
        state={state}
        style={styles.toolBar}
      />

      <View style={styles.editor}>
        <MarkdownEditor.Root
          onChange={setText}
          onChangeState={setState}
          placeholder={t('placeholder')}
          ref={editor}
          value={text}
        />
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create((theme) => ({
  editor: {
    flex: 1,
  },
  main: {
    flex: 1,
  },
  toolBar: {
    backgroundColor: theme.colors.gray.uiAlpha,
  },
}))
