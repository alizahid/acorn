import { SectionList } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Pressable } from '~/components/common/pressable'
import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
import { listProps } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'
import { type ColorToken } from '~/styles/tokens'

export function SettingsThemesScreen() {
  const t = useTranslations('screen.settings.themes')

  const { theme, update } = usePreferences()

  const { styles } = useStyles(stylesheet)

  return (
    <SectionList
      {...listProps}
      renderItem={({ item, section }) => {
        const current = `${item}${section.title === 'dark' ? 'Dark' : 'Light'}`

        const selected = item === theme || current === theme

        return (
          <Pressable
            align="center"
            direction="row"
            gap="4"
            onPress={() => {
              update({
                theme:
                  section.title === 'auto'
                    ? ('acorn' as const)
                    : item === 'acorn'
                      ? ('acorn' as const)
                      : (`${item}${section.title === 'dark' ? 'Dark' : 'Light'}` as const),
              })
            }}
            px="4"
            py="3"
            style={styles.item(selected)}
          >
            <View
              align="center"
              height="6"
              justify="center"
              style={styles.icon(item)}
              width="6"
            />

            <Text weight="medium">{t(item)}</Text>
          </Pressable>
        )
      }}
      renderSectionHeader={({ section }) => (
        <View px="4" py="2" style={styles.header}>
          <Text weight="medium">{t(section.title)}</Text>
        </View>
      )}
      sections={
        [
          {
            data: ['acorn'],
            title: 'auto',
          },
          {
            data: ['ruby', 'plum', 'indigo', 'jade'],
            title: 'light',
          },
          {
            data: ['ruby', 'plum', 'indigo', 'jade'],
            title: 'dark',
          },
        ] as const
      }
      stickySectionHeadersEnabled={false}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  header: {
    backgroundColor: theme.colors.gray.a2,
  },
  icon: (color: ColorToken | 'acorn') => ({
    backgroundColor: theme.colors[color === 'acorn' ? 'orange' : color].a9,
    borderCurve: 'continuous',
    borderRadius: theme.space[5],
  }),
  item: (selected: boolean) => ({
    backgroundColor: selected ? theme.colors.accent.a5 : undefined,
  }),
}))
