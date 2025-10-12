import { CompassIcon } from 'phosphor-react-native/src/icons/Compass'
import { DiscordLogoIcon } from 'phosphor-react-native/src/icons/DiscordLogo'
import { DotsSixVerticalIcon } from 'phosphor-react-native/src/icons/DotsSixVertical'
import { GithubLogoIcon } from 'phosphor-react-native/src/icons/GithubLogo'
import { ListDashesIcon } from 'phosphor-react-native/src/icons/ListDashes'
import { ListNumbersIcon } from 'phosphor-react-native/src/icons/ListNumbers'
import { RedditLogoIcon } from 'phosphor-react-native/src/icons/RedditLogo'
import { TextBIcon } from 'phosphor-react-native/src/icons/TextB'
import { TextHOneIcon } from 'phosphor-react-native/src/icons/TextHOne'
import { TextItalicIcon } from 'phosphor-react-native/src/icons/TextItalic'
import { TextStrikethroughIcon } from 'phosphor-react-native/src/icons/TextStrikethrough'
import { createElement } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { withUnistyles } from 'react-native-unistyles'

export type PhosphorIconName = keyof typeof icons

export type IconWeight = 'regular' | 'bold' | 'fill' | 'duotone'

type Props = {
  color?: string
  name: PhosphorIconName
  size?: number
  style?: StyleProp<ViewStyle>
  weight?: IconWeight
}

export const PhosphorIcon = withUnistyles(
  ({ color, name, size = 24, style, weight = 'regular' }: Props) =>
    createElement(icons[name], {
      color,
      size,
      style,
      weight,
    }),
  (theme) => ({
    color: theme.colors.accent.accent,
    size: theme.space[5],
  }),
)

const icons = {
  Compass: CompassIcon,
  DiscordLogo: DiscordLogoIcon,
  DotsSixVertical: DotsSixVerticalIcon,
  GithubLogo: GithubLogoIcon,
  ListDashes: ListDashesIcon,
  ListNumbers: ListNumbersIcon,
  RedditLogo: RedditLogoIcon,
  TextB: TextBIcon,
  TextHOne: TextHOneIcon,
  TextItalic: TextItalicIcon,
  TextStrikethrough: TextStrikethroughIcon,
} as const
