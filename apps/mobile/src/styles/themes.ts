import { createDarkPalette, createLightPalette } from './colors'
import { radius, space, typography } from './tokens'

export type Theme =
  | 'acorn'
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
  radius,
  space,
  typography,
} as const

export const darkTheme = {
  colors: createDarkPalette('orange'),
  radius,
  space,
  typography,
} as const

export const rubyLight = {
  colors: createLightPalette('ruby'),
  radius,
  space,
  typography,
} as const

export const rubyDark = {
  colors: createDarkPalette('ruby'),
  radius,
  space,
  typography,
} as const

export const plumLight = {
  colors: createLightPalette('plum'),
  radius,
  space,
  typography,
} as const

export const plumDark = {
  colors: createDarkPalette('plum'),
  radius,
  space,
  typography,
} as const

export const indigoLight = {
  colors: createLightPalette('indigo'),
  radius,
  space,
  typography,
} as const

export const indigoDark = {
  colors: createDarkPalette('indigo'),
  radius,
  space,
  typography,
} as const

export const jadeLight = {
  colors: createLightPalette('jade'),
  radius,
  space,
  typography,
} as const

export const jadeDark = {
  colors: createDarkPalette('jade'),
  radius,
  space,
  typography,
} as const
