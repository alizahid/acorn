import { createDarkPalette, createLightPalette } from './colors'
import { radius, space, typography } from './tokens'

export type Theme =
  | 'acorn'
  | 'acornLight'
  | 'acornDark'
  | 'rubyLight'
  | 'rubyDark'
  | 'plumLight'
  | 'plumDark'
  | 'indigoLight'
  | 'indigoDark'
  | 'jadeLight'
  | 'jadeDark'

export const lightTheme = {
  colors: createLightPalette('orange'),
  name: 'light',
  radius,
  space,
  typography,
} as const

export const darkTheme = {
  colors: createDarkPalette('orange'),
  name: 'dark',
  radius,
  space,
  typography,
} as const

export const rubyLight = {
  colors: createLightPalette('ruby'),
  name: 'light',
  radius,
  space,
  typography,
} as const

export const rubyDark = {
  colors: createDarkPalette('ruby'),
  name: 'dark',
  radius,
  space,
  typography,
} as const

export const plumLight = {
  colors: createLightPalette('plum'),
  name: 'light',
  radius,
  space,
  typography,
} as const

export const plumDark = {
  colors: createDarkPalette('plum'),
  name: 'dark',
  radius,
  space,
  typography,
} as const

export const indigoLight = {
  colors: createLightPalette('indigo'),
  name: 'light',
  radius,
  space,
  typography,
} as const

export const indigoDark = {
  colors: createDarkPalette('indigo'),
  name: 'dark',
  radius,
  space,
  typography,
} as const

export const jadeLight = {
  colors: createLightPalette('jade'),
  name: 'light',
  radius,
  space,
  typography,
} as const

export const jadeDark = {
  colors: createDarkPalette('jade'),
  name: 'dark',
  radius,
  space,
  typography,
} as const
