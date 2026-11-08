import { type PostPoll } from '@acorn/reddit'
import { isAfter } from 'date-fns'
import { sumBy } from 'lodash'
import { useState } from 'react'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useFormatter, useNow, useTranslations } from 'use-intl'

import { Button } from '~/components/common/button'
import { usePostPoll } from '~/hooks/mutations/posts/poll'

import { Text } from '../../common/text'
import { PollOptionCard } from './option'

type Props = {
  poll: PostPoll
  postId: string
}

export function PostPollCard({ poll, postId }: Props) {
  const t = useTranslations('component.posts.poll')
  const f = useFormatter()
  const now = useNow()

  const { vote, isPending } = usePostPoll()

  const [value, setValue] = useState<string>()

  const closed = isAfter(now, poll.endsAt)

  const total =
    closed || poll.selected ? sumBy(poll.options, 'votes') : undefined

  return (
    <View style={styles.main}>
      <Text highContrast={false} size="1">
        {t(closed ? 'closed' : 'closes', {
          time: f.relativeTime(poll.endsAt, now),
        })}
      </Text>

      <View style={styles.content}>
        {poll.options.map((option) => (
          <PollOptionCard
            closed={closed}
            key={option.id}
            onChange={setValue}
            option={option}
            selected={poll.selected}
            total={total}
            value={value}
          />
        ))}
      </View>

      {closed || poll.selected ? null : (
        <Button
          disabled={!value}
          label={t('vote')}
          loading={isPending}
          onPress={() => {
            if (!value) {
              return
            }

            vote({
              option: value,
              postId,
            })
          }}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  content: {
    gap: theme.space[4],
  },
  main: {
    backgroundColor: theme.colors.gray.ui,
    borderCurve: 'continuous',
    borderRadius: theme.radius[4],
    gap: theme.space[4],
    marginHorizontal: -theme.space[3],
    padding: theme.space[4],
  },
}))
