import { useMutation } from '@tanstack/react-query'
import { Image, type ImageSource } from 'expo-image'
// biome-ignore lint/performance/noNamespaceImport: go away
import * as ImagePicker from 'expo-image-picker'
import { useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'

import { type CreatePostForm } from '~/hooks/mutations/posts/create'
import { generateVideoThumbnail, uploadFile } from '~/reddit/media'

import { Focusable } from '../common/focusable'
import { Icon } from '../common/icon'
import { IconButton } from '../common/icon/button'
import { Pressable } from '../common/pressable'
import { Spinner } from '../common/spinner'
import { Text } from '../common/text'

type Props = {
  type?: 'image' | 'video'
  onStatusChange?: (loading: boolean) => void
}

export function SubmissionImage({ onStatusChange, type = 'image' }: Props) {
  const t = useTranslations('component.submission.image')
  const a11y = useTranslations('a11y')

  const { control, setValue } = useFormContext<CreatePostForm>()

  const [asset, setAsset] = useState<ImagePicker.ImagePickerAsset>()
  const [preview, setPreview] = useState<ImageSource>()

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset
  useEffect(() => {
    setAsset(undefined)
    setPreview(undefined)
  }, [type])

  const { isPending, mutate } = useMutation({
    async mutationFn() {
      onStatusChange?.(true)

      const { assets } = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: type === 'video' ? 'videos' : 'images',
      })

      const $asset = assets?.[0]

      if (!$asset) {
        return
      }

      setAsset($asset)

      if ($asset.type === 'video') {
        const thumbnail = await generateVideoThumbnail($asset)

        setPreview({
          uri: thumbnail.uri,
        })

        return {
          poster: await uploadFile(thumbnail),
          video: await uploadFile($asset),
        }
      }

      setPreview({
        uri: $asset.uri,
      })

      return {
        image: await uploadFile($asset),
      }
    },
    onError(error) {
      toast.error(error.message)

      setAsset(undefined)
      setPreview(undefined)
    },
    onSettled() {
      onStatusChange?.(false)
    },
    onSuccess(data) {
      if (data?.image?.url) {
        setValue('url', data.image.url)
      }

      if (data?.video?.url && data.poster.url) {
        setValue('url', data.video.url)
        setValue('posterUrl', data.poster.url)
      }
    },
  })

  return (
    <Controller
      control={control}
      name="url"
      render={({ field }) => (
        <Pressable
          accessibilityLabel={a11y('chooseImage')}
          disabled={isPending}
          onPress={() => {
            mutate()
          }}
          style={styles.main}
        >
          <Focusable onFocus={mutate} ref={field.ref} />

          {asset ? (
            <>
              <Image
                accessibilityIgnoresInvertColors
                source={preview}
                style={styles.image}
              />

              {isPending ? (
                <View style={styles.overlay}>
                  <View style={styles.loading}>
                    <Spinner />
                  </View>
                </View>
              ) : null}

              <IconButton
                label={a11y('removeImage')}
                onPress={() => {
                  setAsset(undefined)
                }}
                style={styles.delete}
              >
                <Icon
                  name="trash"
                  uniProps={(theme) => ({
                    color: theme.colors.red.accent,
                  })}
                />
              </IconButton>
            </>
          ) : (
            <View style={styles.placeholder}>
              <Icon
                name={type === 'video' ? 'video' : 'image'}
                uniProps={(theme) => ({
                  size: theme.space[9],
                })}
              />

              <Text weight="medium">{t(`placeholder.${type}`)}</Text>

              <Spinner style={styles.spinner(isPending)} />
            </View>
          )}
        </Pressable>
      )}
    />
  )
}

const styles = StyleSheet.create((theme, runtime) => ({
  delete: {
    backgroundColor: theme.colors.ui.bgAlpha,
    borderTopLeftRadius: theme.radius[6],
    bottom: 0,
    position: 'absolute',
    right: 0,
  },
  image: {
    backgroundColor: theme.colors.accent.ui,
    flex: 1,
  },
  item: {
    height: runtime.screen.width / 3,
    width: runtime.screen.width / 3,
  },
  loading: {
    backgroundColor: theme.colors.ui.bgAlpha,
    borderRadius: theme.space[9],
    padding: theme.space[4],
  },
  main: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    alignItems: 'center',
    flex: 1,
    gap: theme.space[4],
    justifyContent: 'center',
  },
  spinner: (loading: boolean) => ({
    opacity: loading ? 1 : 0,
  }),
}))
