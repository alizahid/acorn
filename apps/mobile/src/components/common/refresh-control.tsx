import { useCallback, useState } from 'react'
import { RefreshControl as ReactNativeRefreshControl } from 'react-native'
import { useStyles } from 'react-native-unistyles'

import { type ColorToken } from '~/styles/tokens'

type Props = {
  color?: ColorToken
  offset?: number
  onRefresh: () => Promise<unknown>
}

export function RefreshControl({ color = 'accent', offset, onRefresh }: Props) {
  const { theme } = useStyles()

  const [refreshing, setRefreshing] = useState(false)

  const refresh = useCallback(async () => {
    setRefreshing(true)

    await onRefresh()

    setRefreshing(false)
  }, [onRefresh])

  return (
    <ReactNativeRefreshControl
      colors={[theme.colors[color].a9, theme.colors[color].a10]}
      onRefresh={refresh}
      progressViewOffset={offset}
      refreshing={refreshing}
      tintColor={theme.colors[color].a9}
    />
  )
}
