import mitt from 'mitt'

export type Events = {
  'switch-account'?: never
}

export const mitter = mitt<Events>()
