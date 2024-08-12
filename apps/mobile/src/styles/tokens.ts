import { type BlackAndWhite, type Colors, createPalette } from './colors'

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

export type RadiusToken = keyof typeof typography

/* eslint-disable sort-keys-fix/sort-keys-fix -- preserve order */

export const lightTheme = {
  colors: {
    // theme
    accent: createPalette<Colors>('orange', 'orangeA'),
    black: createPalette<BlackAndWhite>('blackA'),
    white: createPalette<BlackAndWhite>('whiteA'),
    gray: createPalette<Colors>('sand', 'sandA'),

    // radix
    amber: createPalette<Colors>('amber', 'amberA'),
    blue: createPalette<Colors>('blue', 'blueA'),
    bronze: createPalette<Colors>('bronze', 'bronzeA'),
    brown: createPalette<Colors>('brown', 'brownA'),
    crimson: createPalette<Colors>('crimson', 'crimsonA'),
    cyan: createPalette<Colors>('cyan', 'cyanA'),
    gold: createPalette<Colors>('gold', 'goldA'),
    grass: createPalette<Colors>('grass', 'grassA'),
    green: createPalette<Colors>('green', 'greenA'),
    indigo: createPalette<Colors>('indigo', 'indigoA'),
    iris: createPalette<Colors>('iris', 'irisA'),
    jade: createPalette<Colors>('jade', 'jadeA'),
    lime: createPalette<Colors>('lime', 'limeA'),
    mauve: createPalette<Colors>('mauve', 'mauveA'),
    mint: createPalette<Colors>('mint', 'mintA'),
    olive: createPalette<Colors>('olive', 'oliveA'),
    orange: createPalette<Colors>('orange', 'orangeA'),
    pink: createPalette<Colors>('pink', 'pinkA'),
    plum: createPalette<Colors>('plum', 'plumA'),
    purple: createPalette<Colors>('purple', 'purpleA'),
    red: createPalette<Colors>('red', 'redA'),
    ruby: createPalette<Colors>('ruby', 'rubyA'),
    sage: createPalette<Colors>('sage', 'sageA'),
    sand: createPalette<Colors>('sand', 'sandA'),
    sky: createPalette<Colors>('sky', 'skyA'),
    slate: createPalette<Colors>('slate', 'slateA'),
    teal: createPalette<Colors>('teal', 'tealA'),
    tomato: createPalette<Colors>('tomato', 'tomatoA'),
    violet: createPalette<Colors>('violet', 'violetA'),
    yellow: createPalette<Colors>('yellow', 'yellowA'),
  },
  space,
  radius,
  typography,
} as const

export const darkTheme = {
  colors: {
    // theme
    accent: createPalette<Colors>('orangeDark', 'orangeDarkA'),
    black: createPalette<BlackAndWhite>('blackA'),
    white: createPalette<BlackAndWhite>('whiteA'),
    gray: createPalette<Colors>('sandDark', 'sandDarkA'),

    // radix
    amber: createPalette<Colors>('amberDark', 'amberDarkA'),
    blue: createPalette<Colors>('blueDark', 'blueDarkA'),
    bronze: createPalette<Colors>('bronzeDark', 'bronzeDarkA'),
    brown: createPalette<Colors>('brownDark', 'brownDarkA'),
    crimson: createPalette<Colors>('crimsonDark', 'crimsonDarkA'),
    cyan: createPalette<Colors>('cyanDark', 'cyanDarkA'),
    gold: createPalette<Colors>('goldDark', 'goldDarkA'),
    grass: createPalette<Colors>('grassDark', 'grassDarkA'),
    green: createPalette<Colors>('greenDark', 'greenDarkA'),
    indigo: createPalette<Colors>('indigoDark', 'indigoDarkA'),
    iris: createPalette<Colors>('irisDark', 'irisDarkA'),
    jade: createPalette<Colors>('jadeDark', 'jadeDarkA'),
    lime: createPalette<Colors>('limeDark', 'limeDarkA'),
    mauve: createPalette<Colors>('mauveDark', 'mauveDarkA'),
    mint: createPalette<Colors>('mintDark', 'mintDarkA'),
    olive: createPalette<Colors>('oliveDark', 'oliveDarkA'),
    orange: createPalette<Colors>('orangeDark', 'orangeDarkA'),
    pink: createPalette<Colors>('pinkDark', 'pinkDarkA'),
    plum: createPalette<Colors>('plumDark', 'plumDarkA'),
    purple: createPalette<Colors>('purpleDark', 'purpleDarkA'),
    red: createPalette<Colors>('redDark', 'redDarkA'),
    ruby: createPalette<Colors>('rubyDark', 'rubyDarkA'),
    sage: createPalette<Colors>('sageDark', 'sageDarkA'),
    sand: createPalette<Colors>('sandDark', 'sandDarkA'),
    sky: createPalette<Colors>('skyDark', 'skyDarkA'),
    slate: createPalette<Colors>('slateDark', 'slateDarkA'),
    teal: createPalette<Colors>('tealDark', 'tealDarkA'),
    tomato: createPalette<Colors>('tomatoDark', 'tomatoDarkA'),
    violet: createPalette<Colors>('violetDark', 'violetDarkA'),
    yellow: createPalette<Colors>('yellowDark', 'yellowDarkA'),
  },
  space,
  radius,
  typography,
} as const

/* eslint-enable sort-keys-fix/sort-keys-fix -- preserve order */
