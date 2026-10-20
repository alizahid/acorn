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
    added: ['Deleted comments will now show in the comment list'],
    build: 94,
    fixed: [
      "Login screen should not go blank anymore. You'll be able to see the Reddit cookie banner properly",
      'You can now subscribe to the lifetime plan',
      'Videos will be muted if the post is tagged NSFW or spoiler and you have "Blur NSFW" or "Blur spoiler" enabled, even if "Mute feed" is disabled',
      'Restoring purchases should work now',
    ],
  },
  {
    added: [
      'Perforated cutoff option added to replace the blur cutoff for tall images',
    ],
    build: 93,
    changed: [
      'Thumbnails are now higher resolution; up to 1200px on the longest side',
      'All settings have been reset',
    ],
    fixed: [
      'Blank login screen',
      'Comments opening in browser instead of Acorn when "Use old Reddit links" is enabled',
      'Creating comments should work now',
      "Extra offset when scrolling to next comment so it doesn't get blurred",
      'You can now subscribe to the lifetime plan',
    ],
  },
]
