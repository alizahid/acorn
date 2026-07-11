import { type ReactNode, useState } from 'react'
import {
  type StyleProp,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native'
import Animated, {
  LayoutAnimationConfig,
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon } from '../icon'
import { IconButton } from '../icon/button'
import { Item } from './item'

type Props = {
  label: string
  labelStyle?: StyleProp<TextStyle>
  left?: ReactNode
  onPress?: () => void
  style?: StyleProp<ViewStyle>
}

export function Confirm({ label, labelStyle, left, onPress, style }: Props) {
  const t = useTranslations('component.common.sheet.confirm')

  const [open, setOpen] = useState(false)

  return (
    <LayoutAnimationConfig skipEntering>
      {open ? (
        <Animated.View
          entering={SlideInRight}
          exiting={SlideOutRight}
          key="open"
          style={style}
        >
          <Item
            label={t('title')}
            left={left}
            right={
              <View style={styles.confirm}>
                <IconButton
                  label={t('no')}
                  onPress={() => {
                    setOpen(false)
                  }}
                >
                  <Icon
                    name="x-circle-fill"
                    uniProps={(theme) => ({
                      color: theme.colors.blue.accent,
                    })}
                  />
                </IconButton>

                <IconButton label={t('yes')} onPress={onPress}>
                  <Icon
                    name="check-circle-fill"
                    uniProps={(theme) => ({
                      color: theme.colors.red.accent,
                    })}
                  />
                </IconButton>
              </View>
            }
          />
        </Animated.View>
      ) : (
        <Animated.View
          entering={SlideInLeft}
          exiting={SlideOutLeft}
          key="closed"
          style={style}
        >
          <Item
            label={label}
            labelStyle={labelStyle}
            left={left}
            onPress={() => {
              setOpen(true)
            }}
          />
        </Animated.View>
      )}
    </LayoutAnimationConfig>
  )
}

const styles = StyleSheet.create({
  confirm: {
    flexDirection: 'row',
  },
})
