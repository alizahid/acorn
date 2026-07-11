import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { cardMaxWidth, iPad } from '~/lib/common'

import { Button } from '../common/button'
import { Icon } from '../common/icon'

type Props = {
  onPress?: (commentId?: string) => void
  parentId?: string
}

export function PostHeader({ onPress, parentId }: Props) {
  const a11y = useTranslations('a11y')

  styles.useVariants({
    iPad,
  })

  return (
    <View style={styles.main}>
      <Button
        label={a11y('viewFullThread')}
        left={
          <Icon
            name="arrow-u-up-left"
            uniProps={(theme) => ({
              color: theme.colors.accent.contrast,
            })}
          />
        }
        onPress={() => {
          onPress?.()
        }}
        style={styles.button}
      />

      <Button
        label={a11y('viewParentThread')}
        left={
          <Icon
            name="arrow-up-left"
            uniProps={(theme) => ({
              color: theme.colors.accent.contrast,
            })}
          />
        }
        onPress={() => {
          onPress?.(parentId)
        }}
        style={styles.button}
      />
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  button: {
    flex: 1,
  },
  main: {
    flexDirection: 'row',
    gap: theme.space[3],
    marginTop: theme.space[2],
    variants: {
      iPad: {
        false: {
          padding: theme.space[3],
        },
        true: {
          alignSelf: 'center',
          borderCurve: 'continuous',
          borderRadius: theme.radius[3],
          maxWidth: cardMaxWidth,
          width: '100%',
        },
      },
    },
  },
}))
