import { useCallback, useState } from 'react'
import { RefreshControl as ReactNativeRefreshControl } from 'react-native'
import { withUnistyles } from 'react-native-unistyles'

import { triggerFeedback } from '~/lib/feedback'
import { type ColorToken } from '~/styles/tokens'

const Component = withUnistyles(ReactNativeRefreshControl)

type Props = {
  color?: ColorToken
  offset?: number
  onRefresh: () => Promise<unknown>
}

export function RefreshControl({ color = 'accent', offset, onRefresh }: Props) {
  const [refreshing, setRefreshing] = useState(false)

  const refresh = useCallback(async () => {
    triggerFeedback('refresh')

    setRefreshing(true)

    await onRefresh()

    setRefreshing(false)
  }, [onRefresh])

  return (
    <Component
      onRefresh={refresh}
      progressViewOffset={offset}
      refreshing={refreshing}
      uniProps={(theme) => ({
        tintColor: theme.colors[color].accent,
      })}
    />
  )
}
