import table from '@native-html/heuristic-table-plugin'
import { Image } from 'expo-image'
import { useState } from 'react'
import { type TextStyle } from 'react-native'
import {
  type CustomMixedRenderer,
  type CustomTextualRenderer,
  type TBlock,
  useContentWidth,
} from 'react-native-render-html'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { ImageMenu } from '~/components/posts/gallery/menu'
import { useLink } from '~/hooks/link'
import { previewImages } from '~/lib/preview'

import { Pressable } from '../pressable'

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

export const Img: CustomMixedRenderer = ({ tnode }) => {
  const a11y = useTranslations('a11y')

  const maxWidth = useContentWidth()

  const url = tnode.attributes.src as string

  const height = Number(tnode.attributes.height)
  const width = Number(tnode.attributes.width)

  return (
    <ImageMenu url={url}>
      <Pressable
        accessibilityLabel={a11y('viewImage')}
        onPress={() => {
          previewImages([
            {
              height,
              type: 'image',
              url,
              width,
            },
          ])
        }}
        style={styles.image(maxWidth, {
          height,
          width,
        })}
      >
        <Image source={url} style={styles.full} />
      </Pressable>
    </ImageMenu>
  )
}

export const a: CustomMixedRenderer = ({
  TDefaultRenderer,
  tnode,
  ...props
}) => {
  const { handleLink } = useLink()

  if (tnode.children[0]?.tagName === 'img') {
    return (
      <Img
        TDefaultRenderer={TDefaultRenderer}
        {...props}
        tnode={tnode.children[0] as TBlock}
      />
    )
  }

  return (
    <TDefaultRenderer
      tnode={tnode}
      {...props}
      onPress={() => {
        if (typeof tnode.attributes.href === 'string') {
          handleLink(tnode.attributes.href)
        }
      }}
    />
  )
}

const styles = StyleSheet.create((theme) => ({
  full: {
    flex: 1,
  },
  image: (
    maxWidth: number,
    dimensions: {
      height: number
      width: number
    },
  ) => {
    if (dimensions.width > maxWidth) {
      const scale = maxWidth / dimensions.width

      return {
        height: Math.round(dimensions.height * scale),
        width: maxWidth,
      }
    }

    return {
      height: dimensions.height,
      width: dimensions.width,
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
  a,
  img: Img,
  spoiler,
}
