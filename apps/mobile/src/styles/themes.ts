import { createDarkPalette, createLightPalette } from './colors'
import { radius, space, typography } from './tokens'

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
