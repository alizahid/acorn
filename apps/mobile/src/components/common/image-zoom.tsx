import { ZOOM_TYPE, Zoomable } from '@likashefqet/react-native-image-zoom'
import { Image, type ImageStyle } from 'expo-image'
import * as StatusBar from 'expo-status-bar'
import { useState } from 'react'
import { type StyleProp, StyleSheet } from 'react-native'

import { useImagePlaceholder } from '~/hooks/image'

import { View } from './view'

type Props = {
  recyclingKey?: string
  source: string
  style?: StyleProp<ImageStyle>
}

export function ImageZoom({ recyclingKey, source, style }: Props) {
  const [zoomed, setZoomed] = useState(false)
  const [hidden, setHidden] = useState(false)

  const placeholder = useImagePlaceholder()

  return (
    <View style={style}>
      <Zoomable
        isDoubleTapEnabled
        isPanEnabled={zoomed}
        isSingleTapEnabled
        minPanPointers={1}
        onDoubleTap={(type) => {
          setZoomed(type === ZOOM_TYPE.ZOOM_IN)
        }}
        onSingleTap={() => {
          StatusBar.setStatusBarHidden(!hidden, 'fade')

          setHidden(!hidden)
        }}
      >
        <Image
          {...placeholder}
          contentFit="contain"
          recyclingKey={recyclingKey}
          source={source}
          style={styles.main}
        />
      </Zoomable>
    </View>
  )
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
})
