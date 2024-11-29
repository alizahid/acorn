import { uniq } from 'lodash'
import { useCallback, useMemo } from 'react'
import { useMMKVString } from 'react-native-mmkv'

export function useSearchHistory(community?: string) {
  const [data, setData] = useMMKVString(
    community ? `search_history_${community}` : 'search_history',
  )

  const history = useMemo(
    () => (JSON.parse(data ?? '[]') as Array<string>).slice(-5),
    [data],
  )

  const save = useCallback(
    (query: string) => {
      if (query.length < 2 || history.includes(query)) {
        return
      }

      setData(JSON.stringify(uniq([...history, query])))
    },
    [history, setData],
  )

  const clear = useCallback(() => {
    setData(JSON.stringify([]))
  }, [setData])

  return {
    clear,
    history,
    save,
  }
}
