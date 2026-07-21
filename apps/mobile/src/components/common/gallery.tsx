import { useEffect, useRef } from 'react'
import { createCallable } from 'react-call'
import { Share } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { useCopy } from '~/hooks/copy'
import { useCopyImage, useDownloadImage, useShareImage } from '~/hooks/image'
import { useLink } from '~/hooks/link'
import { useDownloadVideo } from '~/hooks/video'

import { Icon } from './icon'
import { Logo } from './logo'
import { Sheet } from './sheet'

type Props = {
  type: 'image' | 'video' | 'link'
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

  const { copy: copyLink } = useCopy()
  const { openInApp, openInBrowser } = useLink()
  const { copy: copyImage } = useCopyImage()
  const { share: shareImage } = useShareImage()
  const { download: downloadImage } = useDownloadImage()
  const { download: downloadVideo } = useDownloadVideo()

  return (
    <Sheet.Root ref={sheet}>
      <Sheet.Header
        title={t(
          type === 'image'
            ? 'image.title'
            : type === 'link'
              ? 'link.title'
              : 'video.title',
        )}
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
      ) : null}

      {type === 'video' ? (
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
      ) : null}

      {type === 'link' ? (
        <>
          <Sheet.Item
            label={t('link.copy')}
            left={<Icon name="copy" />}
            onPress={() => {
              call.end()

              copyLink(url)
            }}
          />

          <Sheet.Item
            label={t('link.openApp')}
            left={<Logo style={styles.acorn} />}
            onPress={async () => {
              await openInApp(url)

              call.end()
            }}
          />

          <Sheet.Item
            label={t('link.openBrowser')}
            left={<Icon name="compass" />}
            onPress={() => {
              call.end()

              openInBrowser(url)
            }}
          />

          <Sheet.Item
            label={t('link.share')}
            left={<Icon name="export" />}
            onPress={async () => {
              await Share.share({
                url,
              })

              call.end()
            }}
          />
        </>
      ) : null}

      <Sheet.BottomInset />
    </Sheet.Root>
  )
}, 250)

const styles = StyleSheet.create((theme) => ({
  acorn: {
    height: theme.space[5],
    width: theme.space[5],
  },
}))
