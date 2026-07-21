import { range, sortBy, uniqBy } from 'lodash'
import { useCallback, useMemo } from 'react'
import { View } from 'react-native'
import {
  Gesture,
  GestureDetector,
  type GestureUpdateEvent,
  type PanGestureHandlerEventPayload,
  type TapGestureHandlerEventPayload,
} from 'react-native-gesture-handler'
import { clamp, interpolate } from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'

import { type Community } from '~/types/community'

import { Icon } from '../common/icon'
import { Text } from '../common/text'

type AlphabetItem = {
  community: Community
  index: number
  key: string
}

type Props = {
  data: Array<AlphabetItem>
  onScroll: (index: number) => void
}

export function AlphabetList({ data, onScroll }: Props) {
  const items = useMemo(() => {
    const favorites = data.some((item) => item.community.favorite)

    const communities = sortBy(
      uniqBy(
        data
          .filter((item) => !item.community.favorite)
          .map((item) => {
            const name = item.community.name.toUpperCase()

            let letter = item.community.user
              ? name.slice(2, 3)
              : name.slice(0, 1)

            if (String(Number(letter)) === letter) {
              letter = '0'
            }

            return {
              index: item.index,
              key: item.key,
              letter,
            }
          }),
        'letter',
      ),
      'letter',
    )

    if (favorites) {
      const favorite = data.find((item) => item.community.favorite)!

      return [
        {
          index: 0,
          key: favorite.key,
          letter: 'favorite',
        },
        ...communities,
      ]
    }

    return communities
  }, [data])

  const onChange = useCallback(
    (
      event: GestureUpdateEvent<
        PanGestureHandlerEventPayload | TapGestureHandlerEventPayload
      >,
    ) => {
      const height = items.length * 20
      const letters = range(items.length)

      const y = clamp(event.y, 0, height)

      const value = interpolate(
        y,
        letters.map((item) => item * (height / items.length)),
        letters,
      )

      const index = Number(String(value).split('.')[0]) || 0

      const exists = data.find((item) => item.key === items[index]?.key)

      onScroll(exists?.index ?? 0)
    },
    [items, data, onScroll],
  )

  const pan = Gesture.Pan()
    .runOnJS(true)
    .onUpdate((event) => {
      onChange(event)
    })

  const tap = Gesture.Tap()
    .runOnJS(true)
    .onEnd((event) => {
      onChange(event)
    })

  return (
    <View style={styles.main}>
      <GestureDetector gesture={Gesture.Exclusive(pan, tap)}>
        <View style={styles.content}>
          {items.map((item) =>
            item.letter === 'favorite' ? (
              <View key={item.key} style={styles.letter}>
                <Icon
                  name="star-fill"
                  size={14}
                  uniProps={(theme) => ({
                    color: theme.colors.amber.accent,
                  })}
                />
              </View>
            ) : (
              <Text
                key={item.key}
                size="1"
                style={styles.letter}
                variant="mono"
                weight="medium"
              >
                {item.letter}
              </Text>
            ),
          )}
        </View>
      </GestureDetector>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  content: {
    alignItems: 'center',
    width: theme.space[5],
  },
  letter: {
    height: 20,
  },
  main: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    top: 0,
  },
}))
