import table from '@native-html/heuristic-table-plugin'
import { Image } from 'expo-image'
import { useState } from 'react'
import { type TextStyle } from 'react-native'
import {
  type CustomMixedRenderer,
  type CustomTextualRenderer,
  useContentWidth,
} from 'react-native-render-html'
import { StyleSheet } from 'react-native-unistyles'

import { ImageMenu } from '~/components/posts/gallery/menu'

export const spoiler: CustomTextualRenderer = ({
  TDefaultRenderer,
  ...props
}) => {
  const [visible, setVisible] = useState(false)

  return (
    <TDefaultRenderer
      {...props}
      onPress={
        visible
          ? undefined
          : () => {
              setVisible(true)
            }
      }
      style={[props.style as TextStyle, styles.spoiler(visible)]}
    />
  )
}

export const img: CustomMixedRenderer = ({ tnode }) => {
  const width = useContentWidth()

  const uri = tnode.attributes.src as string

  return (
    <ImageMenu url={uri}>
      <Image
        source={{
          uri,
        }}
        style={styles.image(width, {
          height: Number(tnode.attributes.height),
          width: Number(tnode.attributes.width),
        })}
      />
    </ImageMenu>
  )
}

const styles = StyleSheet.create((theme) => ({
  image: (
    maxWidth: number,
    dimensions: {
      height: number
      width: number
    },
  ) => {
    if (dimensions.width <= maxWidth) {
      return {
        height: dimensions.height,
        width: dimensions.width,
      }
    }

    const scale = maxWidth / dimensions.width

    return {
      height: Math.round(dimensions.height * scale),
      width: maxWidth,
    }
  },
  spoiler: (visible: boolean) => ({
    alignSelf: 'flex-start',
    backgroundColor: visible ? undefined : theme.colors.accent.accent,
    color: visible ? theme.colors.gray.text : theme.colors.accent.accent,
  }),
}))

export const renderers = {
  ...table,
  img,
  spoiler,
}
