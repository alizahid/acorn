import { type ReactNode } from 'react'
import Toast from 'react-native-toast-message'

export type ToastType = 'success' | 'error' | 'loading'

export type ToastProps = {
  icon?: ReactNode
}

type Id = string | number

type Options = {
  description?: string
  duration?: number
  icon?: ReactNode
  id?: Id
}

let current: Id | undefined
let counter = 0

function show(type: ToastType, title: string, options: Options = {}) {
  counter += 1

  const id = options.id ?? counter

  current = id

  Toast.show({
    autoHide: options.duration !== Number.POSITIVE_INFINITY,
    onHide() {
      if (current === id) {
        current = undefined
      }
    },
    props: {
      icon: options.icon,
    } satisfies ToastProps,
    text1: title,
    text2: options.description,
    type,
    visibilityTime: options.duration ?? 4000,
  })

  return id
}

export const toast = {
  dismiss(id?: Id) {
    if (id === undefined || id === current) {
      Toast.hide()
    }
  },
  error(title: string, options?: Options) {
    return show('error', title, options)
  },
  loading(title: string, options?: Options) {
    return show('loading', title, options)
  },
  success(title: string, options?: Options) {
    return show('success', title, options)
  },
}
