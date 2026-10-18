import { useMutation } from '@tanstack/react-query'
import { Image, type ImageSource } from 'expo-image'
// biome-ignore lint/performance/noNamespaceImport: go away
import * as ImagePicker from 'expo-image-picker'
import { useState } from 'react'
import { Controller } from 'react-hook-form'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'

import { generateVideoThumbnail, uploadFile } from '~/reddit/media'

import { Focusable } from '../common/focusable'
import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Spinner } from '../common/spinner'
import { Text } from '../common/text'
import { useSubmission } from './provider'

type Props = {
  onStatusChange?: (loading: boolean) => void
}

export function SubmissionVideo({ onStatusChange }: Props) {
  const t = useTranslations('component.submission.video')

  const { form } = useSubmission()

  const [preview, setPreview] = useState<ImageSource>()

  const { isPending, mutate } = useMutation({
    async mutationFn() {
      onStatusChange?.(true)

      const { assets, canceled } = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'videos',
        preferredAssetRepresentationMode:
          ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible,
      })

      if (canceled) {
        return
      }

      const [asset] = assets

      if (!asset) {
        return
      }

      const thumbnail = await generateVideoThumbnail(asset)

      setPreview({
        uri: thumbnail.uri,
      })

      return {
        poster: {
          asset: thumbnail,
          file: await uploadFile(thumbnail),
        },
        video: {
          asset,
          file: await uploadFile(asset),
        },
      }
    },
    onError(error) {
      toast.error(error.message)

      setPreview(undefined)
    },
    onSettled() {
      onStatusChange?.(false)
    },
    onSuccess(data) {
      if (data) {
        form.setValue('poster', {
          id: data.poster.file.id,
          uri: data.poster.file.url,
          url: data.poster.file.url,
        })

        form.setValue('video', {
          id: data.video.file.id,
          uri: data.video.file.url,
          url: data.video.file.url,
        })
      }
    },
  })

  const errors = form.getErrors('video')

  return (
    <Controller
      control={form.control}
      name="poster"
      render={({ field }) => (
        <View style={styles.main}>
          {errors?.message ? (
            <Text color="red" mt="3" mx="4" size="2">
              {errors.message}
            </Text>
          ) : null}

          <Focusable
            onFocus={() => {
              mutate()
            }}
            ref={field.ref}
          />

          {field.value?.uri ? (
            <View style={styles.item}>
              <Image
                accessibilityIgnoresInvertColors
                source={preview}
                style={styles.image}
              />

              <Pressable
                accessibilityLabel={t('remove')}
                onPress={() => {
                  setPreview(undefined)

                  type Item = {
                    id: string
                    url: string
                    uri: string
                  }

                  form.setValue('poster', undefined as unknown as Item)
                  form.setValue('video', undefined as unknown as Item)
                }}
                style={styles.delete}
              >
                <Icon
                  name="x-bold"
                  uniProps={(theme) => ({
                    color: theme.colors.red.contrast,
                    size: theme.space[4],
                  })}
                />
              </Pressable>
            </View>
          ) : (
            <Pressable
              accessibilityLabel={t('pick')}
              disabled={isPending}
              onPress={() => {
                mutate()
              }}
              style={[styles.item, styles.upload]}
            >
              {isPending ? (
                <Spinner
                  uniProps={(theme) => ({
                    color: theme.colors.accent.contrast,
                  })}
                />
              ) : (
                <Icon
                  name="plus-bold"
                  uniProps={(theme) => ({
                    color: theme.colors.accent.contrast,
                    size: theme.space[6],
                  })}
                />
              )}
            </Pressable>
          )}
        </View>
      )}
    />
  )
}

const styles = StyleSheet.create((theme) => ({
  delete: {
    alignItems: 'center',
    backgroundColor: theme.colors.red.accent,
    borderRadius: theme.space[5],
    height: theme.space[5],
    justifyContent: 'center',
    position: 'absolute',
    right: -theme.space[1],
    top: -theme.space[1],
    width: theme.space[5],
  },
  image: {
    backgroundColor: theme.colors.accent.ui,
    borderCurve: 'continuous',
    borderRadius: theme.radius[4],
    flex: 1,
  },
  item: {
    borderCurve: 'continuous',
    borderRadius: theme.radius[4],
    height: theme.space[9],
    width: theme.space[9],
  },
  main: {
    backgroundColor: theme.colors.accent.ui,
    gap: theme.space[4],
    padding: theme.space[4],
  },
  upload: {
    alignItems: 'center',
    backgroundColor: theme.colors.accent.accent,
    justifyContent: 'center',
  },
}))
