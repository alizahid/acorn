import { useMutation } from '@tanstack/react-query'
import { Image, type ImageSource } from 'expo-image'
// biome-ignore lint/performance/noNamespaceImport: go away
import * as ImagePicker from 'expo-image-picker'
import { type VideoThumbnail } from 'expo-video'
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
}

export function SubmissionImage({ type = 'image' }: Props) {
  const t = useTranslations('component.submission.image')
  const a11y = useTranslations('a11y')

  const { control, setValue } = useFormContext<CreatePostForm>()

  const [asset, setAsset] = useState<ImagePicker.ImagePickerAsset>()
  const [preview, setPreview] = useState<VideoThumbnail | ImageSource>()

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset
  useEffect(() => {
    setAsset(undefined)
    setPreview(undefined)
  }, [type])

  const { isPending, mutate } = useMutation({
    async mutationFn() {
      const { assets } = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: type === 'video' ? 'videos' : 'images',
      })

      const asset = assets?.[0]

      if (!asset) {
        return
      }

      console.log('asset', asset)

      if (asset.type === 'video') {
        const thumbnail = await generateVideoThumbnail(asset.uri)

        setPreview(thumbnail)
      } else {
        setPreview({
          uri: asset.uri,
        })
      }

      setAsset(asset)

      return uploadFile(asset)
    },
    onError(error) {
      console.log('error', error)
      toast.error(error.message)
    },
    onSuccess(data) {
      if (data?.url) {
        setValue('url', data.url)
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
                <View style={styles.loading}>
                  <View style={styles.spinner}>
                    <Spinner size="large" />
                  </View>
                </View>
              ) : null}

              <IconButton
                color="red"
                icon="trash"
                label={a11y('removeImage')}
                onPress={() => {
                  setAsset(undefined)
                }}
                style={styles.delete}
              />
            </>
          ) : (
            <View style={styles.placeholder}>
              <Icon
                name={type === 'video' ? 'video' : 'photo'}
                uniProps={(theme) => ({
                  size: theme.space[9],
                })}
              />

              <Text weight="medium">{t(`placeholder.${type}`)}</Text>

              {isPending ? (
                <View style={styles.loading}>
                  <View style={styles.spinner}>
                    <Spinner size="large" />
                  </View>
                </View>
              ) : null}
            </View>
          )}
        </Pressable>
      )}
    />
  )
}

const styles = StyleSheet.create((theme, runtime) => ({
  delete: {
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
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: {
    flex: 1,
  },
  placeholder: {
    alignItems: 'center',
    flex: 1,
    gap: theme.space[4],
    justifyContent: 'center',
  },
  spinner: {
    backgroundColor: theme.colors.gray.ui,
    borderRadius: theme.space[9],
    padding: theme.space[4],
  },
}))
