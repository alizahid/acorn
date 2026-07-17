import { createPalette } from './colors'
import { radius, space, typography } from './tokens'

const lightTheme = {
  colors: createPalette('orange'),
  name: 'acorn-light',
  radius,
  space,
  typography,
  variant: 'light',
} as const

const darkTheme = {
  colors: createPalette('orange', true),
  name: 'acorn-dark',
  radius,
  space,
  typography,
  variant: 'dark',
} as const

const rubyLight = {
  colors: createPalette('ruby'),
  name: 'ruby-light',
  radius,
  space,
  typography,
  variant: 'light',
} as const

const rubyDark = {
  colors: createPalette('ruby', true),
  name: 'ruby-dark',
  radius,
  space,
  typography,
  variant: 'dark',
} as const

const plumLight = {
  colors: createPalette('plum'),
  name: 'plum-light',
  radius,
  space,
  typography,
  variant: 'light',
} as const

const plumDark = {
  colors: createPalette('plum', true),
  name: 'plum-dark',
  radius,
  space,
  typography,
  variant: 'dark',
} as const

const indigoLight = {
  colors: createPalette('indigo'),
  name: 'indigo-light',
  radius,
  space,
  typography,
  variant: 'light',
} as const

const indigoDark = {
  colors: createPalette('indigo', true),
  name: 'indigo-dark',
  radius,
  space,
  typography,
  variant: 'dark',
} as const

const jadeLight = {
  colors: createPalette('jade'),
  name: 'jade-light',
  radius,
  space,
  typography,
  variant: 'light',
} as const

const jadeDark = {
  colors: createPalette('jade', true),
  name: 'jade-dark',
  radius,
  space,
  typography,
  variant: 'dark',
} as const

export const themes = {
  acorn: lightTheme,
  'acorn-dark': darkTheme,
  'acorn-light': lightTheme,
  dark: darkTheme,
  indigo: indigoLight,
  'indigo-dark': indigoDark,
  'indigo-light': indigoLight,
  jade: jadeLight,
  'jade-dark': jadeDark,
  'jade-light': jadeLight,
  light: lightTheme,
  plum: plumLight,
  'plum-dark': plumDark,
  'plum-light': plumLight,
  ruby: rubyLight,
  'ruby-dark': rubyDark,
  'ruby-light': rubyLight,
}

export type Theme = keyof typeof themes
