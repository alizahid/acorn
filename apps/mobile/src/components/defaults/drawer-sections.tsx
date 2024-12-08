import { type StyleProp, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { type DrawerSection, type DrawerSections } from '~/types/defaults'

import { Icon, type IconName } from '../common/icon'
import { Text } from '../common/text'
import { View } from '../common/view'
import { HeaderButton } from '../navigation/header-button'

type Props = {
  data: DrawerSections
  onChange: (data: DrawerSections) => void
  style?: StyleProp<ViewStyle>
}

export function DefaultsDrawerSections({ data, onChange, style }: Props) {
  const t = useTranslations('component.defaults.drawerSections')

  const { styles, theme } = useStyles(stylesheet)

  return (
    <View gap="2" style={style}>
      <Text weight="medium">{t('title')}</Text>

      <View style={styles.content}>
        {data.map((item, index) => (
          <View align="center" direction="row" height="8" key={item} pl="3">
            <Icon color={theme.colors.accent.a9} name={icons[item]} />

            <Text mx="3" style={styles.label} weight="medium">
              {t(item)}
            </Text>

            {index > 0 ? (
              <HeaderButton
                icon="ArrowUp"
                onPress={() => {
                  const next = [...data]

                  const [$item] = next.splice(index, 1)

                  if (!$item) {
                    return
                  }

                  next.splice(index - 1, 0, $item)

                  onChange(next)
                }}
                weight="bold"
              />
            ) : (
              <View width="8" />
            )}

            {index < data.length - 1 ? (
              <HeaderButton
                icon="ArrowDown"
                onPress={() => {
                  const next = [...data]

                  const [$item] = next.splice(index, 1)

                  if (!$item) {
                    return
                  }

                  next.splice(index + 1, 0, $item)

                  onChange(next)
                }}
                weight="bold"
              />
            ) : (
              <View width="8" />
            )}
          </View>
        ))}
      </View>
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  content: {
    backgroundColor: theme.colors.gray.a2,
    borderCurve: 'continuous',
    borderRadius: theme.radius[4],
  },
  label: {
    flex: 1,
  },
}))

const icons: Record<DrawerSection, IconName> = {
  communities: 'UsersFour',
  feed: 'House',
  feeds: 'NoteBlank',
  users: 'User',
}
