export const fonts = {
  apercu: 'Apercu Pro Var',
  basis: 'Basis Grotesque Pro Var',
  fold: 'Fold Grotesque Pro',
  inter: 'Inter Variable',
  mono: 'SF Mono',
  system: 'System',
}

export type Font = Exclude<keyof typeof fonts, 'mono'>

if (process.env.EXPO_PUBLIC_DEMO === 'yes') {
  for (const key of Object.keys(fonts)) {
    fonts[key as Font] = 'Redacted'
  }
}
