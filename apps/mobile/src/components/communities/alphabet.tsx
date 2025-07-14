import { range, sortBy, uniqBy } from 'lodash'
import { useCallback, useMemo } from 'react'
import {
  Gesture,
  GestureDetector,
  type GestureUpdateEvent,
  type PanGestureHandlerEventPayload,
  type TapGestureHandlerEventPayload,
} from 'react-native-gesture-handler'
import { clamp, interpolate } from 'react-native-reanimated'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { type Community } from '~/types/community'

import { Icon } from '../common/icon'
import { Text } from '../common/text'
import { View } from '../common/view'

export type AlphabetItem = {
  data: Community
  key: string
  type: 'community' | 'user'
}

type Props = {
  data: Array<AlphabetItem>
  onScroll: (index: number) => void
}

export function AlphabetList({ data, onScroll }: Props) {
  const { styles, theme } = useStyles(stylesheet)

  const items = useMemo(() => {
    const favorites = data.some((item) => item.data.favorite)

    const communities = sortBy(
      uniqBy(
        data
          .filter((item) => !item.data.favorite)
          .map((item, index) => {
            const name = item.data.name.toUpperCase()

            let letter =
              item.type === 'user' ? name.slice(2, 3) : name.slice(0, 1)

            if (String(Number(letter)) === letter) {
              letter = '0'
            }

            return {
              index: favorites ? index + 1 : index,
              key: item.key,
              letter,
            }
          }),
        'letter',
      ),
      'letter',
    )

    if (favorites) {
      const favorite = data.find((item) => item.data.favorite)!

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
      const length = items.length

      if (length === 1) {
        onScroll(0)

        return
      }

      const height = length * 18
      const letters = range(length)

      const y = clamp(event.y, 0, height)

      const value = interpolate(
        y,
        letters.map((item) => item * (height / length)),
        letters,
      )

      const index = Number(String(value).split('.')[0]) || 0

      onScroll(data.findIndex((item) => item.key === items[index]?.key))
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
    <GestureDetector gesture={Gesture.Exclusive(pan, tap)}>
      <View style={styles.main}>
        {items.map((item) =>
          item.letter === 'favorite' ? (
            <View justify="center" key={item.key} style={styles.letter}>
              <Icon
                color={theme.colors.amber.accent}
                name="Star"
                size={10}
                weight="fill"
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
  )
}

const stylesheet = createStyleSheet((theme) => ({
  letter: {
    height: 18,
  },
  main: {
    alignItems: 'center',
    marginTop: theme.space[8],
    position: 'absolute',
    right: 0,
    top: 0,
    width: theme.space[6],
  },
}))
