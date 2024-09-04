import { type SharedValue } from 'react-native-reanimated'
import { useTranslations } from 'use-intl'

import { useCommon } from '~/hooks/common'
import { CommunityTab } from '~/types/community'

import { SegmentedControl } from '../common/segmented-control'
import { View } from '../common/view'

type Props = {
  offset: SharedValue<number>
  onChange: (index: number) => void
}

export function CommunitiesHeader({ offset, onChange }: Props) {
  const common = useCommon()

  const t = useTranslations('component.communities.header')

  return (
    <View pt={common.insets.top}>
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
