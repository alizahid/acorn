import mitt from 'mitt'

export type Events = {
  'hide-nav'?: never
  'show-nav'?: never
  'switch-account'?: never
}

export const mitter = mitt<Events>()
