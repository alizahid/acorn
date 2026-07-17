import { useEffect, useRef } from 'react'
import { createCallable } from 'react-call'
import { useTranslations } from 'use-intl'

import { useCopyImage, useDownloadImage, useShareImage } from '~/hooks/image'
import { useDownloadVideo } from '~/hooks/video'

import { Icon } from './icon'
import { Sheet } from './sheet'

type Props = {
  type: 'image' | 'video'
  url: string
}

export const Gallery = createCallable<Props>(({ call, type, url }) => {
  const t = useTranslations('component.common.gallery')

  const sheet = useRef<Sheet>(null)

  useEffect(() => {
    if (call.ended) {
      sheet.current?.dismiss()

      return
    }

    sheet.current?.present()
  }, [call.ended])

  const { copy: copyImage } = useCopyImage()
  const { share: shareImage } = useShareImage()
  const { download: downloadImage } = useDownloadImage()
  const { download: downloadVideo } = useDownloadVideo()

  return (
    <Sheet.Root ref={sheet}>
      <Sheet.Header
        title={t(type === 'image' ? 'image.title' : 'video.title')}
      />

      {type === 'image' ? (
        <>
          <Sheet.Item
            label={t('image.copy')}
            left={<Icon name="copy" />}
            onPress={() => {
              call.end()

              copyImage({
                url,
              })
            }}
          />

          <Sheet.Item
            label={t('image.share')}
            left={<Icon name="export" />}
            onPress={() => {
              call.end()

              shareImage({
                url,
              })
            }}
          />

          <Sheet.Item
            label={t('image.download')}
            left={<Icon name="download" />}
            onPress={() => {
              call.end()

              downloadImage({
                url,
              })
            }}
          />
        </>
      ) : (
        <Sheet.Item
          label={t('video.download')}
          left={<Icon name="download" />}
          onPress={() => {
            call.end()

            downloadVideo({
              url,
            })
          }}
        />
      )}

      <Sheet.BottomInset />
    </Sheet.Root>
  )
}, 250)
