// biome-ignore lint/performance/noNamespaceImport: go away
import * as Speech from 'expo-speech'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { useShallow } from 'zustand/react/shallow'

import { speech } from '~/lib/speech'
import { useSpeech } from '~/stores/speech'

import { Icon } from './icon'
import { IconButton } from './icon/button'
import { Text } from './text'

export function SpeechPlayer() {
  const t = useTranslations('component.common.speech')

  const { boundary, status, text } = useSpeech(
    useShallow((state) => ({
      boundary: state.boundary,
      status: state.status,
      text: state.text,
    })),
  )

  return (
    <View style={styles.main}>
      {status === 'error' ? (
        <IconButton accessibilityLabel={t('error')} disabled>
          <Icon
            name="warning-fill"
            uniProps={(theme) => ({
              color: theme.colors.red.accent,
            })}
          />
        </IconButton>
      ) : (
        <IconButton
          accessibilityLabel={t(status === 'speaking' ? 'pause' : 'resume')}
          onPress={() => {
            if (status === 'speaking') {
              speech.pause()
            } else {
              speech.resume()
            }
          }}
        >
          <Icon name={status === 'speaking' ? 'pause-fill' : 'play-fill'} />
        </IconButton>
      )}

      <View style={styles.text}>
        {text && boundary ? (
          <Text align="center" weight="medium">
            {text.slice(boundary[0], boundary[1])}
          </Text>
        ) : null}
      </View>

      <IconButton
        accessibilityLabel={t('stop')}
        onPress={() => {
          Speech.stop()
        }}
      >
        <Icon name="stop-fill" />
      </IconButton>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  main: {
    flexDirection: 'row',
    gap: theme.space[4],
  },
  text: {
    flex: 1,
    justifyContent: 'center',
  },
}))
