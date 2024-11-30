import { uniq } from 'lodash'
import { create } from 'mutative'
import { useCallback, useMemo } from 'react'
import { useMMKVString } from 'react-native-mmkv'

export type SearchHistoryData = ReturnType<typeof useSearchHistory>

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

  const remove = useCallback(
    (query: string) => {
      const index = history.indexOf(query)

      if (index < 0) {
        return
      }

      const next = create(history, (draft) => {
        draft.splice(index, 1)
      })

      setData(JSON.stringify(next))
    },
    [history, setData],
  )

  const clear = useCallback(() => {
    setData(JSON.stringify([]))
  }, [setData])

  return {
    clear,
    history,
    remove,
    save,
  }
}
