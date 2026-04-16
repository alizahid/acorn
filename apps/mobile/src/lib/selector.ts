import { type StoreApi, type UseBoundStore } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

export function createSelectorHook<State extends object>(
  store: UseBoundStore<StoreApi<State>>,
) {
  return <Keys extends keyof State>(keys: Keys[]) =>
    store(
      useShallow((state) => {
        const result = {} as Pick<State, Keys>

        for (const key of keys) {
          result[key] = state[key]
        }

        return result
      }),
    )
}
