import { type SharedValue } from 'react-native-reanimated'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { CommunityTab } from '~/types/community'

import { SegmentedControl } from '../common/segmented-control'
import { View } from '../common/view'

type Props = {
  offset: SharedValue<number>
  onChange: (index: number) => void
}

export function CommunitiesHeader({ offset, onChange }: Props) {
  const t = useTranslations('component.communities.header')

  const { styles } = useStyles(stylesheet)

  return (
    <View style={styles.main}>
      <SegmentedControl
        items={CommunityTab.map((item) => t(item))}
        offset={offset}
        onChange={(index) => {
          onChange(index)
        }}
      />
    </View>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  main: {
    paddingTop: runtime.insets.top,
  },
}))
