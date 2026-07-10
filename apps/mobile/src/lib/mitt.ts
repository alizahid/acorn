import mitt from 'mitt'

export type Events = {
  'drawer-close'?: never
  'drawer-open'?: never
  'drawer-toggle'?: never
  'switch-account'?: never
}

export const mitter = mitt<Events>()
