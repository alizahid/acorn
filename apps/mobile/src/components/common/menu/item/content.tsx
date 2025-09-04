import { type ReactNode } from 'react'
import { type StyleProp, type TextStyle } from 'react-native'

import { Icon } from '~/components/common/icon'
import { Spinner } from '~/components/common/spinner'
import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'

type Props = {
  arrow?: boolean
  description?: string
  label: string
  labelStyle?: StyleProp<TextStyle>
  left?: ReactNode
  loading?: boolean
  right?: ReactNode
}

export function MenuItemContent({
  arrow,
  description,
  label,
  labelStyle,
  left,
  loading,
  right,
}: Props) {
  return (
    <>
      {loading ? (
        <Spinner
          uniProps={(theme) => ({
            color: theme.colors.accent.contrast,
            size: theme.space[5],
          })}
        />
      ) : (
        left
      )}

      <View flex={1}>
        <Text style={labelStyle} weight="medium">
          {label}
        </Text>

        {description ? (
          <Text color="gray" highContrast={false} size="1">
            {description}
          </Text>
        ) : null}
      </View>

      {right}

      {arrow ? (
        <Icon
          name="CaretRight"
          uniProps={(theme) => ({
            color: theme.colors.gray.accent,
            size: theme.space[4],
          })}
        />
      ) : null}
    </>
  )
}
