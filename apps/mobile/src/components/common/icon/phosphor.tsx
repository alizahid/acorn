import { type ComponentProps } from 'react'
import { createNanoIconSet } from 'react-native-nano-icons'
import { withUnistyles } from 'react-native-unistyles'

import glyphMap from '~/assets/icons/phosphor/phosphor.glyphmap.json'

const Nano = createNanoIconSet(glyphMap)

export type IconName = ComponentProps<typeof Nano>['name']

export const PhosphorIcon = withUnistyles(Nano, (theme) => ({
  color: theme.colors.accent.accent,
  size: theme.space[5],
}))
