export const breakpoints = {
  initial: 0,
  lg: 1280,
  md: 1024,
  sm: 768,
  xl: 1640,
  xs: 520,
} as const

export const space = {
  '1': 4,
  '2': 8,
  '3': 12,
  '4': 16,
  '5': 24,
  '6': 32,
  '7': 40,
  '8': 48,
  '9': 64,
} as const

export type SpaceToken = keyof typeof space

export const typography = {
  '1': {
    fontSize: 12,
    lineHeight: 16,
  },
  '2': {
    fontSize: 14,
    lineHeight: 20,
  },
  '3': {
    fontSize: 16,
    lineHeight: 24,
  },
  '4': {
    fontSize: 18,
    lineHeight: 26,
  },
  '5': {
    fontSize: 20,
    lineHeight: 28,
  },
  '6': {
    fontSize: 24,
    lineHeight: 30,
  },
  '7': {
    fontSize: 28,
    lineHeight: 36,
  },
  '8': {
    fontSize: 35,
    lineHeight: 40,
  },
  '9': {
    fontSize: 60,
    lineHeight: 60,
  },
} as const

export type TypographyToken = keyof typeof typography

export const radius = {
  '1': 3,
  '2': 4,
  '3': 6,
  '4': 8,
  '5': 12,
  '6': 16,
} as const

export type RadiusToken = keyof typeof radius

export const ColorTokens = [
  'accent',
  'gray',

  'amber',
  'blue',
  'green',
  'red',

  'crimson',
  'gold',
  'grass',
  'indigo',
  'jade',
  'orange',
  'plum',
  'ruby',
  'teal',
  'tomato',
  'violet',
] as const

export type ColorToken = (typeof ColorTokens)[number]
