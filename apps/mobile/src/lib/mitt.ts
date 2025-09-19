import mitt from 'mitt'

export type Events = {
  'hide-header'?: never
  'hide-tab-bar'?: never
  'show-header'?: never
  'show-tab-bar'?: never
  'switch-account'?: never
}

export const mitter = mitt<Events>()
