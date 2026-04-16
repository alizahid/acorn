import { type StoreApi, type UseBoundStore } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

export function createSelectorHook<
  Payload extends object,
  State extends Payload,
>(store: UseBoundStore<StoreApi<State>>, methods: Array<keyof State>) {
  return <Keys extends keyof Payload>(keys: Keys[]) =>
    store(
      useShallow((state) => {
        const result = {} as Pick<Payload, Keys> & Omit<State, keyof Payload>

        for (const key of keys) {
          result[key as keyof typeof result] = state[key as keyof State] as never
        }

        for (const key of methods) {
          result[key as keyof typeof result] = state[key] as never
        }

        return result
      }),
    )
}
