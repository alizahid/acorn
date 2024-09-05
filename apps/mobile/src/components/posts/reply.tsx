import { forwardRef, useState } from 'react'
import { TextInput } from 'react-native'
import Animated from 'react-native-reanimated'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { useKeyboard } from '~/hooks/keyboard'
import { usePostReply } from '~/hooks/mutations/posts/reply'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Spinner } from '../common/spinner'
import { Text } from '../common/text'
import { View } from '../common/view'

type Props = {
  commentId?: string
  onReset: () => void
  postId?: string
  user?: string
}

export const PostReplyCard = forwardRef<TextInput, Props>(
  function PostReplyCard({ commentId, onReset, postId, user }, ref) {
    const t = useTranslations('component.posts.reply')

    const keyboard = useKeyboard()

    const { styles, theme } = useStyles(stylesheet)

    const { isPending, reply } = usePostReply()

    const [focused, setFocused] = useState(false)
    const [text, setText] = useState('')

    return (
      <Animated.View style={[styles.main, keyboard.styles]}>
        <TextInput
          editable={!isPending}
          multiline
          onBlur={() => {
            setFocused(false)
          }}
          onChangeText={setText}
          onFocus={() => {
            setFocused(true)
          }}
          placeholder={t('placeholder')}
          placeholderTextColor={theme.colors.gray.a9}
          ref={ref}
          selectionColor={theme.colors.accent.a9}
          style={styles.input(focused)}
          textAlignVertical="top"
          value={text}
        />

        {focused ? (
          <View align="center" direction="row" gap="4">
            {user ? (
              <Pressable
                align="center"
                direction="row"
                gap="2"
                onPress={onReset}
                p="4"
              >
                <Icon
                  color={theme.colors.red.a9}
                  name="X"
                  size={theme.typography[2].lineHeight}
                  weight="fill"
                />

                <Text size="2">
                  {t('comment', {
                    user,
                  })}
                </Text>
              </Pressable>
            ) : null}

            <Pressable
              disabled={!postId || isPending}
              ml="auto"
              onPress={() => {
                if (!postId || text.length === 0) {
                  return
                }

                reply({
                  commentId,
                  postId,
                  text,
                })

                setText('')
                onReset()
              }}
              p="4"
            >
              {isPending ? (
                <Spinner />
              ) : (
                <Text color={postId ? 'accent' : 'gray'} weight="bold">
                  {t('submit')}
                </Text>
              )}
            </Pressable>
          </View>
        ) : null}
      </Animated.View>
    )
  },
)

const stylesheet = createStyleSheet((theme, runtime) => ({
  input: (open: boolean) => ({
    color: theme.colors.gray.a11,
    fontSize: theme.typography[3].fontSize,
    height: open ? theme.space[9] * 2 : undefined,
    lineHeight: theme.typography[3].lineHeight,
    padding: theme.space[3],
    paddingBottom: theme.space[4] + (open ? 0 : runtime.insets.bottom),
  }),
  main: {
    backgroundColor: theme.colors.gray.a2,
  },
}))
