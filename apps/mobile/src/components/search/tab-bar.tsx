import { type SharedValue } from 'react-native-reanimated'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { SearchTab } from '~/types/search'

import { SegmentedControl } from '../common/segmented-control'
import { View } from '../common/view'

type Props = {
  offset: SharedValue<number>
  onPress: (tab: string) => void
}

export function SearchTabBar({ offset, onPress }: Props) {
  const t = useTranslations('component.search.tabBar')

  const { styles } = useStyles(stylesheet)

  return (
    <View style={styles.main}>
      <SegmentedControl
        items={SearchTab.map((item) => t(item))}
        offset={offset}
        onChange={(index) => {
          const next = SearchTab[index]

          if (next) {
            onPress(next)
          }
        }}
      />
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: {
    backgroundColor: theme.colors.gray[1],
  },
}))
