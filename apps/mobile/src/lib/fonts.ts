export const fonts = {
  apercu: 'Apercu Pro Var',
  basis: 'Basis Grotesque Pro Var',
  fold: 'Fold Grotesque Pro',
  inter: 'Inter Variable',
  mono: 'Paper Mono',
  system: undefined as unknown as string,
}

export type Font = Exclude<keyof typeof fonts, 'mono'>
