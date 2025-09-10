import { StyleSheet } from 'react-native-unistyles'

import { Icon } from '~/components/common/icon'
import { Text } from '~/components/common/text'
import { BlurView } from '~/components/native/blur-view'

type Props = {
  label?: string
}

export function GalleryBlur({ label }: Props) {
  return (
    <BlurView intensity={100} pointerEvents="none" style={styles.main}>
      <Icon
        name="Warning"
        uniProps={(theme) => ({
          color: theme.colors.gray.text,
          size: theme.space[5],
        })}
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

const styles = StyleSheet.create((theme) => ({
  main: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    gap: theme.space[4],
    justifyContent: 'center',
  },
}))
