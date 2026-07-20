import { useLocalSearchParams } from 'expo-router'
import { z } from 'zod'
import { useShallow } from 'zustand/react/shallow'

import { CommunityFeed } from '~/components/feeds/community'
import { CustomFeed } from '~/components/feeds/custom'
import { DefaultFeed } from '~/components/feeds/default'
import { useDefaults } from '~/stores/defaults'
import { FeedType } from '~/types/sort'

const schema = z.object({
  feed: z.string().optional(),
  type: z.enum(FeedType).optional(),
})

export type HomeParams = z.infer<typeof schema>

export default function Screen() {
  const params = schema.parse(useLocalSearchParams())

  const defaults = useDefaults(
    useShallow((state) => ({
      community: state.community,
      feed: state.feed,
      feedType: state.feedType,
    })),
  )

  if (params.feed) {
    return <CustomFeed name={params.feed} />
  }

  if (params.type) {
    return <DefaultFeed type={params.type} />
  }

  if (defaults.feed) {
    return <CustomFeed name={defaults.feed} />
  }

  if (defaults.community) {
    return <CommunityFeed name={defaults.community} />
  }

  return <DefaultFeed type={defaults.feedType} />
}
