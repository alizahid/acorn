import { type NativeStackHeaderProps } from 'expo-router'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { useCornerInsets } from '@/helpers'
import { glass } from '~/lib/common'

import { Icon } from '../common/icon'
import { IconButton } from '../common/icon/button'
import { Text } from '../common/text'
import { BlurView } from '../native/blur-view'
import { GlassView } from '../native/glass-view'

type Props = NativeStackHeaderProps

export function Header({ back, navigation, options }: Props) {
  const t = useTranslations('component.navigation.header')

  const cornerInsets = useCornerInsets()

  const modal =
    options.presentation === 'modal' || options.presentation === 'formSheet'

  styles.useVariants({
    glass,
    modal,
  })

  const Component = glass ? GlassView : BlurView

  return (
    <View style={styles.main}>
      {back || options.headerLeft ? (
        <Component
          isInteractive
          style={[styles.item, styles.left(modal ? 0 : cornerInsets.left)]}
        >
          {back ? (
            <IconButton
              label={t('back')}
              onPress={() => {
                navigation.goBack()
              }}
            >
              <Icon name={modal ? 'x-bold' : 'arrow-left-bold'} />
            </IconButton>
          ) : null}

          {options.headerLeft?.({})}
        </Component>
      ) : null}

      {options.title || options.headerTitle ? (
        <Component isInteractive style={[styles.item, styles.title]}>
          {options.headerTitle ? (
            typeof options.headerTitle === 'string' ? (
              <Text weight="bold">{options.headerTitle}</Text>
            ) : (
              options.headerTitle({
                children: 'title',
              })
            )
          ) : options.title ? (
            <Text weight="bold">{options.title}</Text>
          ) : null}
        </Component>
      ) : null}

      {options.headerRight ? (
        <Component
          isInteractive
          style={[styles.item, styles.right(modal ? 0 : cornerInsets.right)]}
        >
          {options.headerRight({})}
        </Component>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create((theme, runtime) => ({
  item: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: theme.space[7],
    flexDirection: 'row',
    height: theme.space[8],
    variants: {
      glass: {
        false: {
          overflow: 'hidden',
        },
      },
    },
  },
  left: (cornerInset: number) => ({
    left: Math.max(0, cornerInset - theme.space[3]),
    position: 'absolute',
    top: 0,
  }),
  main: {
    borderCurve: 'continuous',
    borderRadius: theme.space[7],
    marginHorizontal: theme.space[3],
    variants: {
      modal: {
        false: {
          height: theme.space[8],
          marginBottom: theme.space[4],
          marginTop: runtime.insets.top,
        },
        true: {
          marginVertical: theme.space[4],
        },
      },
    },
  },
  right: (cornerInset: number) => ({
    position: 'absolute',
    right: Math.max(0, cornerInset - theme.space[3]),
    top: 0,
  }),
  title: {
    alignSelf: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.space[4],
  },
}))
