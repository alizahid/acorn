import localFont from 'next/font/local'

export const sans = localFont({
  src: [
    {
      path: './sans-light.otf',
      weight: '300',
    },
    {
      path: './sans-regular.otf',
      weight: '400',
    },
    {
      path: './sans-medium.otf',
      weight: '500',
    },
    {
      path: './sans-bold.otf',
      weight: '700',
    },
  ],
  variable: '--font-sans',
})

export const mono = localFont({
  src: [
    {
      path: './mono-regular.otf',
      weight: '400',
    },
  ],
  variable: '--font-mono',
})
