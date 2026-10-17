export type ChangelogType = 'added' | 'changed' | 'fixed' | 'removed'

export type Changelog = Array<
  {
    [key in ChangelogType]?: Array<string>
  } & {
    build: number
    thanks?: Array<string>
    version?: string
  }
>

export const changelog: Changelog = [
  {
    build: 92,
    changed: [
      'Thumbnails are now higher resolution; up to 1200px on the longest side',
    ],
    fixed: [
      'Blank login screen',
      'Comments opening in browser instead of Acorn when "Use old Reddit links" is enabled',
      'Creating comments should work now',
      'You can now subscribe to the lifetime plan',
    ],
  },
]
