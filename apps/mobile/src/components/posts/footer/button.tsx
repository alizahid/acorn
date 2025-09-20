import { type SFSymbol } from 'expo-symbols'
import { StyleSheet } from 'react-native-unistyles'

import { Icon } from '~/components/common/icon'
import { Pressable } from '~/components/common/pressable'
import { mapColors } from '~/lib/styles'
import { type ColorToken, colors, space } from '~/styles/tokens'

type Props = {
  color?: ColorToken
  compact?: boolean
  fill?: boolean
  icon: SFSymbol
  label: string
  onPress?: () => void
}

export function FooterButton({
  color,
  compact,
  fill,
  icon,
  label,
  onPress,
}: Props) {
  styles.useVariants({
    color,
    fill,
  })

  return (
    <Pressable
      align="center"
      height={compact ? undefined : '6'}
      hitSlop={space[2]}
      justify="center"
      label={label}
      onPress={onPress}
      style={styles.main}
      width={compact ? undefined : '6'}
    >
      <Icon
        name={icon}
        uniProps={(theme) => ({
          size: compact ? theme.typography[1].fontSize : theme.space[5],
          tintColor: fill
            ? theme.colors.white.textAlpha
            : color
              ? theme.colors[color].accent
              : theme.colors[theme.variant === 'dark' ? 'white' : 'black']
                  .textAlpha,
        })}
      />
    </Pressable>
  )
}

const styles = StyleSheet.create((theme) => ({
  main: {
    borderCurve: 'continuous',
    borderRadius: theme.radius[3],
    compoundVariants: colors.map((token) => ({
      color: token,
      fill: true,
      styles: {
        backgroundColor: theme.colors[token].accent,
      },
    })),
    variants: {
      color: mapColors(() => ({})),
      fill: {
        true: {},
      },
    },
  },
}))
