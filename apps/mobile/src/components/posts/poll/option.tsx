import { type PostPoll } from '@acorn/reddit'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useFormatter } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { Pressable } from '~/components/common/pressable'
import { Text } from '~/components/common/text'

type Props = {
  closed: boolean
  onChange?: (value?: string) => void
  option: PostPoll['options'][number]
  selected?: string
  total?: number
  value?: string
}

export function PollOptionCard({
  closed,
  onChange,
  option,
  selected,
  total = 0,
  value,
}: Props) {
  const f = useFormatter()

  if (closed || selected) {
    const votes = option.votes ?? 0
    const core = option.contributors ?? 0

    return (
      <View style={styles.result}>
        <Text size="2">{option.text}</Text>

        <View style={styles.votes}>
          <View
            style={styles.bar('outside', votes, total, option.id === selected)}
          >
            <View
              style={styles.bar('inside', core, votes, option.id === selected)}
            />
          </View>

          <Text size="2" tabular>
            {f.number(votes, {
              notation: 'compact',
            })}
          </Text>
        </View>
      </View>
    )
  }

  return (
    <Pressable
      onPress={() => {
        onChange?.(value === option.id ? undefined : option.id)
      }}
      style={styles.option}
    >
      <Icon name={value === option.id ? 'radio-button-fill' : 'circle'} />

      <Text size="2" style={styles.label}>
        {option.text}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create((theme) => ({
  bar: (
    variant: 'inside' | 'outside',
    count: number,
    total: number,
    selected: boolean,
  ) => ({
    backgroundColor: selected
      ? variant === 'inside'
        ? theme.colors.accent.accent
        : theme.colors.gray.accent
      : variant === 'inside'
        ? theme.colors.accent.border
        : theme.colors.gray.border,
    borderCurve: 'continuous',
    borderRadius: variant === 'outside' ? theme.radius[1] : undefined,
    height: theme.space[5],
    overflow: 'hidden',
    width: `${(count / total) * 100}%`,
  }),
  label: {
    flex: 1,
  },
  option: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[2],
  },
  result: {
    gap: theme.space[1],
  },
  votes: {
    flexDirection: 'row',
    gap: theme.space[4],
    justifyContent: 'space-between',
  },
}))
