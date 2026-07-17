import { type ComponentProps } from 'react'
import { createNanoIconSet } from 'react-native-nano-icons'
import { withUnistyles } from 'react-native-unistyles'

import glyphMap from '~/assets/icons/phosphor/phosphor.glyphmap.json'

const Nano = createNanoIconSet(glyphMap)

type Props = ComponentProps<typeof Nano>

export type IconName = Props['name']

export const Icon = withUnistyles(Nano, (theme) => ({
  allowFontScaling: false,
  color: theme.colors.accent.accent,
  size: theme.space[5],
}))
