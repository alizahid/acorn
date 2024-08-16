import { BlurView } from 'expo-blur'
import { useGlobalSearchParams, useRouter } from 'expo-router'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { useCommon } from '~/hooks/common'
import { CommunitiesType } from '~/types/community'

import { SegmentedControl } from '../common/segmented-control'
import { View } from '../common/view'

const schema = z.object({
  query: z.string().catch(''),
  type: z.enum(CommunitiesType).catch('communities'),
})

export function CommunitiesHeader() {
  const common = useCommon()

  const router = useRouter()

  const params = schema.parse(useGlobalSearchParams())

  const t = useTranslations('component.communities.header')

  const { styles } = useStyles(stylesheet)

  return (
    <BlurView intensity={75} style={styles.main(common.insets.top)}>
      <View p="4">
        <SegmentedControl
          active={CommunitiesType.indexOf(params.type)}
          items={CommunitiesType.map((item) => t(item))}
          onChange={(index) => {
            router.setParams({
              type: CommunitiesType[index],
            })
          }}
        />
      </View>
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
