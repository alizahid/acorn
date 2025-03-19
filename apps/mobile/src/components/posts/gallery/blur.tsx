import { BlurView } from 'expo-blur'
import { StyleSheet } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Icon } from '~/components/common/icon'
import { Text } from '~/components/common/text'

type Props = {
  label?: string
}

export function GalleryBlur({ label }: Props) {
  const { styles, theme } = useStyles(stylesheet)

  return (
    <BlurView
      intensity={100}
      pointerEvents="none"
      style={styles.main}
      tint={theme.name}
    >
      <Icon
        color={theme.colors.gray.text}
        name="Warning"
        size={theme.space[5]}
        weight="fill"
      />

      {label ? (
        <Text size="1" weight="medium">
          {label}
        </Text>
      ) : null}
    </BlurView>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    gap: theme.space[4],
    justifyContent: 'center',
  },
}))
