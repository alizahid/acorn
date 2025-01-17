import { createPalette } from './colors'
import { radius, space, typography } from './tokens'

export type Theme =
  | 'acorn'
  | 'acorn-light'
  | 'acorn-dark'
  | 'ruby-light'
  | 'ruby-dark'
  | 'plum-light'
  | 'plum-dark'
  | 'indigo-light'
  | 'indigo-dark'
  | 'jade-light'
  | 'jade-dark'

export const lightTheme = {
  colors: createPalette('orange'),
  name: 'light',
  radius,
  space,
  typography,
} as const

export const darkTheme = {
  colors: createPalette('orange', true),
  name: 'dark',
  radius,
  space,
  typography,
} as const

export const rubyLight = {
  colors: createPalette('ruby'),
  name: 'light',
  radius,
  space,
  typography,
} as const

export const rubyDark = {
  colors: createPalette('ruby', true),
  name: 'dark',
  radius,
  space,
  typography,
} as const

export const plumLight = {
  colors: createPalette('plum'),
  name: 'light',
  radius,
  space,
  typography,
} as const

export const plumDark = {
  colors: createPalette('plum', true),
  name: 'dark',
  radius,
  space,
  typography,
} as const

export const indigoLight = {
  colors: createPalette('indigo'),
  name: 'light',
  radius,
  space,
  typography,
} as const

export const indigoDark = {
  colors: createPalette('indigo', true),
  name: 'dark',
  radius,
  space,
  typography,
} as const

export const jadeLight = {
  colors: createPalette('jade'),
  name: 'light',
  radius,
  space,
  typography,
} as const

export const jadeDark = {
  colors: createPalette('jade', true),
  name: 'dark',
  radius,
  space,
  typography,
} as const
