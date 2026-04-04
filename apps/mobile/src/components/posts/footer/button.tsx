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
      accessibilityLabel={label}
      hitSlop={space[2]}
      onPress={onPress}
      style={styles.main(compact)}
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
  main: (compact?: boolean) => ({
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: theme.radius[3],
    compoundVariants: colors.map((token) => ({
      color: token,
      fill: true,
      styles: {
        backgroundColor: theme.colors[token].accent,
      },
    })),
    height: compact ? undefined : theme.space[6],
    justifyContent: 'center',
    variants: {
      color: mapColors(() => ({})),
      fill: {
        true: {},
      },
    },
    width: compact ? undefined : theme.space[6],
  }),
}))
