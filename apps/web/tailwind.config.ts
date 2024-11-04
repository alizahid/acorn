import { type Config } from 'tailwindcss'

function createPalette(name: string) {
  const dark = ['sky', 'mint', 'lime', 'yellow', 'amber']

  return Object.fromEntries(
    [...new Array<number>(12)].flatMap((item, index) => [
      [index + 1, `var(--${name}-${index + 1})`],
      [`a${index + 1}`, `var(--${name}-a${index + 1})`],
      ['contrast', dark.includes(name) ? '#000' : '#fff'],
    ]),
  )
}

const config: Config = {
  content: ['./src/**/*.tsx'],
  darkMode: 'class',
  plugins: [],
  theme: {
    extend: {
      colors: {
        accent: createPalette('orange'),
        gray: createPalette('sand'),
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'monospace'],
        sans: ['var(--font-sans)', 'sans-serif'],
      },
    },
  },
}

export default config
