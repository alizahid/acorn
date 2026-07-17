import { useCallback, useState } from 'react'
import { useBottomTabBarHeight } from 'react-native-bottom-tabs'
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, {
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { useReply } from '~/hooks/mutations/messages/reply'
import { glass } from '~/lib/common'
import { space } from '~/styles/tokens'

import { Icon } from '../common/icon'
import { IconButton } from '../common/icon/button'
import { Spinner } from '../common/spinner'
import { TextBox } from '../common/text-box'
import { BlurView } from '../native/blur-view'
import { GlassView } from '../native/glass-view'

type Props = {
  threadId: string
  user: string
}

export function ReplyCard({ threadId, user }: Props) {
  const tabBarHeight = useBottomTabBarHeight()

  const t = useTranslations('component.messages.reply')
  const a11y = useTranslations('a11y')

  const { createReply, isPending } = useReply()

  const { progress } = useReanimatedKeyboardAnimation()

  const [value, setValue] = useState('')

  const onSubmit = useCallback(() => {
    const text = value.trim()

    if (text.length === 0) {
      return
    }

    createReply({
      text,
      threadId,
      user,
    })

    setValue('')
  }, [createReply, value, threadId, user])

  const style = useAnimatedStyle(() => ({
    marginBottom: interpolate(
      progress.get(),
      [0, 1],
      [tabBarHeight + (glass ? space[4] : 0), glass ? space[4] : 0],
    ),
  }))

  const Component = glass ? GlassView : BlurView

  return (
    <Animated.View style={[styles.main, style]}>
      <Component style={styles.content}>
        <TextBox
          onChangeText={setValue}
          onSubmitEditing={() => {
            onSubmit()
          }}
          placeholder={t('placeholder')}
          returnKeyType="send"
          style={styles.textBox}
          styleInput={styles.input}
          value={value}
        />

        <IconButton
          accessibilityLabel={a11y('createReply')}
          disabled={isPending}
          onPress={() => {
            onSubmit()
          }}
        >
          {isPending ? (
            <Spinner />
          ) : (
            <Icon name="paper-plane-tilt-fill" size={20} />
          )}
        </IconButton>
      </Component>
    </Animated.View>
  )
}

const styles = StyleSheet.create((theme) => ({
  content: {
    borderCurve: 'continuous',
    borderRadius: theme.space[7],
    flexDirection: 'row',
  },
  input: {
    paddingHorizontal: theme.space[4],
  },
  main: {
    margin: glass ? theme.space[4] : undefined,
  },
  textBox: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    borderWidth: 0,
    flex: 1,
  },
}))
