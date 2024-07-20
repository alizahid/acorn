import * as colors from '@radix-ui/colors'

import { createPalette, createPaletteWithExtras } from './colors'

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
    black: createPalette(colors.blackA),
    white: createPalette(colors.whiteA),
    accent: createPaletteWithExtras(colors.mint, 'mint'),
    accentA: createPaletteWithExtras(colors.mintA, 'mint'),
    gray: createPaletteWithExtras(colors.sage, 'sage'),
    grayA: createPaletteWithExtras(colors.sageA, 'sage'),

    // radix
    amber: createPaletteWithExtras(colors.amber, 'amber'),
    amberA: createPaletteWithExtras(colors.amberA, 'amber'),
    blue: createPaletteWithExtras(colors.blue, 'blue'),
    blueA: createPaletteWithExtras(colors.blueA, 'blue'),
    bronze: createPaletteWithExtras(colors.bronze, 'bronze'),
    bronzeA: createPaletteWithExtras(colors.bronzeA, 'bronze'),
    brown: createPaletteWithExtras(colors.brown, 'brown'),
    brownA: createPaletteWithExtras(colors.brownA, 'brown'),
    crimson: createPaletteWithExtras(colors.crimson, 'crimson'),
    crimsonA: createPaletteWithExtras(colors.crimsonA, 'crimson'),
    cyan: createPaletteWithExtras(colors.cyan, 'cyan'),
    cyanA: createPaletteWithExtras(colors.cyanA, 'cyan'),
    gold: createPaletteWithExtras(colors.gold, 'gold'),
    goldA: createPaletteWithExtras(colors.goldA, 'gold'),
    grass: createPaletteWithExtras(colors.grass, 'grass'),
    grassA: createPaletteWithExtras(colors.grassA, 'grass'),
    green: createPaletteWithExtras(colors.green, 'green'),
    greenA: createPaletteWithExtras(colors.greenA, 'green'),
    indigo: createPaletteWithExtras(colors.indigo, 'indigo'),
    indigoA: createPaletteWithExtras(colors.indigoA, 'indigo'),
    iris: createPaletteWithExtras(colors.iris, 'iris'),
    irisA: createPaletteWithExtras(colors.irisA, 'iris'),
    jade: createPaletteWithExtras(colors.jade, 'jade'),
    jadeA: createPaletteWithExtras(colors.jadeA, 'jade'),
    lime: createPaletteWithExtras(colors.lime, 'lime'),
    limeA: createPaletteWithExtras(colors.limeA, 'lime'),
    mauve: createPaletteWithExtras(colors.mauve, 'mauve'),
    mauveA: createPaletteWithExtras(colors.mauveA, 'mauve'),
    mint: createPaletteWithExtras(colors.mint, 'mint'),
    mintA: createPaletteWithExtras(colors.mintA, 'mint'),
    olive: createPaletteWithExtras(colors.olive, 'olive'),
    oliveA: createPaletteWithExtras(colors.oliveA, 'olive'),
    orange: createPaletteWithExtras(colors.orange, 'orange'),
    orangeA: createPaletteWithExtras(colors.orangeA, 'orange'),
    pink: createPaletteWithExtras(colors.pink, 'pink'),
    pinkA: createPaletteWithExtras(colors.pinkA, 'pink'),
    plum: createPaletteWithExtras(colors.plum, 'plum'),
    plumA: createPaletteWithExtras(colors.plumA, 'plum'),
    purple: createPaletteWithExtras(colors.purple, 'purple'),
    purpleA: createPaletteWithExtras(colors.purpleA, 'purple'),
    red: createPaletteWithExtras(colors.red, 'red'),
    redA: createPaletteWithExtras(colors.redA, 'red'),
    ruby: createPaletteWithExtras(colors.ruby, 'ruby'),
    rubyA: createPaletteWithExtras(colors.rubyA, 'ruby'),
    sage: createPaletteWithExtras(colors.sage, 'sage'),
    sageA: createPaletteWithExtras(colors.sageA, 'sage'),
    sand: createPaletteWithExtras(colors.sand, 'sand'),
    sandA: createPaletteWithExtras(colors.sandA, 'sand'),
    sky: createPaletteWithExtras(colors.sky, 'sky'),
    skyA: createPaletteWithExtras(colors.skyA, 'sky'),
    slate: createPaletteWithExtras(colors.slate, 'slate'),
    slateA: createPaletteWithExtras(colors.slateA, 'slate'),
    teal: createPaletteWithExtras(colors.teal, 'teal'),
    tealA: createPaletteWithExtras(colors.tealA, 'teal'),
    tomato: createPaletteWithExtras(colors.tomato, 'tomato'),
    tomatoA: createPaletteWithExtras(colors.tomatoA, 'tomato'),
    violet: createPaletteWithExtras(colors.violet, 'violet'),
    violetA: createPaletteWithExtras(colors.violetA, 'violet'),
    yellow: createPaletteWithExtras(colors.yellow, 'yellow'),
    yellowA: createPaletteWithExtras(colors.yellowA, 'yellow'),
  },
  space,
  radius,
  typography,
} as const

export const darkTheme = {
  colors: {
    // theme
    black: createPalette(colors.blackA),
    white: createPalette(colors.whiteA),
    accent: createPaletteWithExtras(colors.mintDark, 'mint', true),
    accentA: createPaletteWithExtras(colors.mintDarkA, 'mint', true),
    gray: createPaletteWithExtras(colors.sageDark, 'sage', true),
    grayA: createPaletteWithExtras(colors.sageDarkA, 'sage', true),

    // radix
    amber: createPaletteWithExtras(colors.amberDark, 'amber', true),
    amberA: createPaletteWithExtras(colors.amberDarkA, 'amber', true),
    blue: createPaletteWithExtras(colors.blueDark, 'blue', true),
    blueA: createPaletteWithExtras(colors.blueDarkA, 'blue', true),
    bronze: createPaletteWithExtras(colors.bronzeDark, 'bronze', true),
    bronzeA: createPaletteWithExtras(colors.bronzeDarkA, 'bronze', true),
    brown: createPaletteWithExtras(colors.brownDark, 'brown', true),
    brownA: createPaletteWithExtras(colors.brownDarkA, 'brown', true),
    crimson: createPaletteWithExtras(colors.crimsonDark, 'crimson', true),
    crimsonA: createPaletteWithExtras(colors.crimsonDarkA, 'crimson', true),
    cyan: createPaletteWithExtras(colors.cyanDark, 'cyan', true),
    cyanA: createPaletteWithExtras(colors.cyanDarkA, 'cyan', true),
    gold: createPaletteWithExtras(colors.goldDark, 'gold', true),
    goldA: createPaletteWithExtras(colors.goldDarkA, 'gold', true),
    grass: createPaletteWithExtras(colors.grassDark, 'grass', true),
    grassA: createPaletteWithExtras(colors.grassDarkA, 'grass', true),
    green: createPaletteWithExtras(colors.greenDark, 'green', true),
    greenA: createPaletteWithExtras(colors.greenDarkA, 'green', true),
    indigo: createPaletteWithExtras(colors.indigoDark, 'indigo', true),
    indigoA: createPaletteWithExtras(colors.indigoDarkA, 'indigo', true),
    iris: createPaletteWithExtras(colors.irisDark, 'iris', true),
    irisA: createPaletteWithExtras(colors.irisDarkA, 'iris', true),
    jade: createPaletteWithExtras(colors.jadeDark, 'jade', true),
    jadeA: createPaletteWithExtras(colors.jadeDarkA, 'jade', true),
    lime: createPaletteWithExtras(colors.limeDark, 'lime', true),
    limeA: createPaletteWithExtras(colors.limeDarkA, 'lime', true),
    mauve: createPaletteWithExtras(colors.mauveDark, 'mauve', true),
    mauveA: createPaletteWithExtras(colors.mauveDarkA, 'mauve', true),
    mint: createPaletteWithExtras(colors.mintDark, 'mint', true),
    mintA: createPaletteWithExtras(colors.mintDarkA, 'mint', true),
    olive: createPaletteWithExtras(colors.oliveDark, 'olive', true),
    oliveA: createPaletteWithExtras(colors.oliveDarkA, 'olive', true),
    orange: createPaletteWithExtras(colors.orangeDark, 'orange', true),
    orangeA: createPaletteWithExtras(colors.orangeDarkA, 'orange', true),
    pink: createPaletteWithExtras(colors.pinkDark, 'pink', true),
    pinkA: createPaletteWithExtras(colors.pinkDarkA, 'pink', true),
    plum: createPaletteWithExtras(colors.plumDark, 'plum', true),
    plumA: createPaletteWithExtras(colors.plumDarkA, 'plum', true),
    purple: createPaletteWithExtras(colors.purpleDark, 'purple', true),
    purpleA: createPaletteWithExtras(colors.purpleDarkA, 'purple', true),
    red: createPaletteWithExtras(colors.redDark, 'red', true),
    redA: createPaletteWithExtras(colors.redDarkA, 'red', true),
    ruby: createPaletteWithExtras(colors.rubyDark, 'ruby', true),
    rubyA: createPaletteWithExtras(colors.rubyDarkA, 'ruby', true),
    sage: createPaletteWithExtras(colors.sageDark, 'sage', true),
    sageA: createPaletteWithExtras(colors.sageDarkA, 'sage', true),
    sand: createPaletteWithExtras(colors.sandDark, 'sand', true),
    sandA: createPaletteWithExtras(colors.sandDarkA, 'sand', true),
    sky: createPaletteWithExtras(colors.skyDark, 'sky', true),
    skyA: createPaletteWithExtras(colors.skyDarkA, 'sky', true),
    slate: createPaletteWithExtras(colors.slateDark, 'slate', true),
    slateA: createPaletteWithExtras(colors.slateDarkA, 'slate', true),
    teal: createPaletteWithExtras(colors.tealDark, 'teal', true),
    tealA: createPaletteWithExtras(colors.tealDarkA, 'teal', true),
    tomato: createPaletteWithExtras(colors.tomatoDark, 'tomato', true),
    tomatoA: createPaletteWithExtras(colors.tomatoDarkA, 'tomato', true),
    violet: createPaletteWithExtras(colors.violetDark, 'violet', true),
    violetA: createPaletteWithExtras(colors.violetDarkA, 'violet', true),
    yellow: createPaletteWithExtras(colors.yellowDark, 'yellow', true),
    yellowA: createPaletteWithExtras(colors.yellowDarkA, 'yellow', true),
  },
  space,
  radius,
  typography,
} as const

/* eslint-enable sort-keys-fix/sort-keys-fix -- preserve order */
