import * as colors from '@radix-ui/colors'
import { compact } from 'lodash'

import { type Undefined } from '~/types'

import { type ColorToken } from './tokens'

type RadixColor = keyof typeof colors

export type ColorScale =
  | 'bg'
  | 'bgAlt'
  | 'ui'
  | 'uiHover'
  | 'uiActive'
  | 'border'
  | 'borderUi'
  | 'borderHover'
  | 'accent'
  | 'accentHover'
  | 'textLow'
  | 'text'

export type ColorScaleAlpha = `${ColorScale}Alpha`
export type ColorScaleExtras = 'contrast'

export type BlackAndWhite = ColorScaleAlpha
export type Colors = ColorScale | ColorScaleAlpha | ColorScaleExtras

type PaletteColor = Exclude<ColorToken, 'accent'>

export function createPalette(color: PaletteColor, dark?: boolean) {
  const gray = getGray(color)

  const suffix = dark ? 'Dark' : ''

  /* eslint-disable sort-keys-fix/sort-keys-fix -- go away */
  return {
    accent: getColors<Colors>(`${color}${suffix}`, `${color}${suffix}A`),
    gray: getColors<Colors>(`${gray}${suffix}`, `${gray}${suffix}A`),

    black: getColors<BlackAndWhite>('blackA'),
    white: getColors<BlackAndWhite>('whiteA'),

    amber: getColors<Colors>(`amber${suffix}`, `amber${suffix}A`),
    blue: getColors<Colors>(`blue${suffix}`, `blue${suffix}A`),
    green: getColors<Colors>(`green${suffix}`, `green${suffix}A`),
    red: getColors<Colors>(`red${suffix}`, `red${suffix}A`),

    crimson: getColors<Colors>(`crimson${suffix}`, `crimson${suffix}A`),
    gold: getColors<Colors>(`gold${suffix}`, `gold${suffix}A`),
    grass: getColors<Colors>(`grass${suffix}`, `grass${suffix}A`),
    indigo: getColors<Colors>(`indigo${suffix}`, `indigo${suffix}A`),
    jade: getColors<Colors>(`jade${suffix}`, `jade${suffix}A`),
    orange: getColors<Colors>(`orange${suffix}`, `orange${suffix}A`),
    plum: getColors<Colors>(`plum${suffix}`, `plum${suffix}A`),
    ruby: getColors<Colors>(`ruby${suffix}`, `ruby${suffix}A`),
    teal: getColors<Colors>(`teal${suffix}`, `teal${suffix}A`),
    tomato: getColors<Colors>(`tomato${suffix}`, `tomato${suffix}A`),
    violet: getColors<Colors>(`violet${suffix}`, `violet${suffix}A`),
  }
  /* eslint-enable sort-keys-fix/sort-keys-fix -- go away */
}

function getGray(color: PaletteColor) {
  if (/crimson|pink|plum|purple|red|ruby|tomato|violet/.test(color)) {
    return 'mauve'
  }

  if (/blue|cyan|indigo|iris|sky/.test(color)) {
    return 'slate'
  }

  if (/green|jade|mint|teal/.test(color)) {
    return 'sage'
  }

  if (/grass|lime/.test(color)) {
    return 'olive'
  }

  if (/amber|brown|orange|yellow/.test(color)) {
    return 'sand'
  }

  return 'gray'
}

export function getColors<Palette extends Colors>(...names: Array<RadixColor>) {
  const palette: Array<[string, string]> = []

  for (const name of names) {
    const alpha = name.endsWith('A')

    palette.push(
      ...Object.values(colors[name]).map((color, index) => {
        const key: Array<Undefined<string>> = [map[index + 1]]

        if (alpha) {
          key.push('Alpha')
        }

        return [compact(key).join(''), color] satisfies [string, string]
      }),
    )

    if (!/white|black/.test(name)) {
      palette.push([
        'contrast',
        /amber|lime|mint|sky|yellow/.test(name) ? '#000' : '#fff',
      ])
    }
  }

  return Object.fromEntries(palette) as Record<Palette, string>
}

const map: Record<number, ColorScale> = {
  1: 'bg',
  10: 'accentHover',
  11: 'textLow',
  12: 'text',
  2: 'bgAlt',
  3: 'ui',
  4: 'uiHover',
  5: 'uiActive',
  6: 'border',
  7: 'borderUi',
  8: 'borderHover',
  9: 'accent',
}
