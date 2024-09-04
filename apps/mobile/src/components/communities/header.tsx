import { BlurView } from 'expo-blur'
import { type SharedValue } from 'react-native-reanimated'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { useCommon } from '~/hooks/common'
import { CommunityTab } from '~/types/community'

import { SegmentedControl } from '../common/segmented-control'

type Props = {
  offset: SharedValue<number>
  onChange: (index: number) => void
}

export function CommunitiesHeader({ offset, onChange }: Props) {
  const common = useCommon()

  const t = useTranslations('component.communities.header')

  const { styles } = useStyles(stylesheet)

  return (
    <BlurView intensity={100} style={styles.main(common.insets.top)}>
      <SegmentedControl
        items={CommunityTab.map((item) => t(item))}
        offset={offset}
        onChange={(index) => {
          onChange(index)
        }}
      />
    </BlurView>
  )
}

const stylesheet = createStyleSheet(() => ({
  main: (inset: number) => ({
    left: 0,
    paddingTop: inset,
    position: 'absolute',
    right: 0,
    top: 0,
  }),
}))
