import { useMutation } from '@tanstack/react-query'
import { Image } from 'expo-image'
// biome-ignore lint/performance/noNamespaceImport: go away
import * as ImagePicker from 'expo-image-picker'
import { Controller, useFieldArray } from 'react-hook-form'
import { View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { StyleSheet } from 'react-native-unistyles'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'

import { uploadFile } from '~/reddit/media'

import { Focusable } from '../common/focusable'
import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Spinner } from '../common/spinner'
import { Text } from '../common/text'
import { useSubmission } from './provider'

type Props = {
  onStatusChange?: (loading: boolean) => void
}

export function SubmissionImage({ onStatusChange }: Props) {
  const t = useTranslations('component.submission.image')

  const { submission, form } = useSubmission()

  const { mutate, isPending } = useMutation({
    async mutationFn() {
      onStatusChange?.(true)

      const { assets, canceled } = await ImagePicker.launchImageLibraryAsync({
        allowsMultipleSelection: submission.media.gallery,
        mediaTypes: 'images',
        preferredAssetRepresentationMode:
          ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible,
      })

      if (canceled || assets.length === 0) {
        return
      }

      return Promise.all(
        assets.map(async (asset) => ({
          asset,
          file: await uploadFile(asset),
        })),
      )
    },
    onError(error) {
      toast.error(error.message)
    },
    onSettled() {
      onStatusChange?.(false)
    },
    onSuccess(data) {
      if (data) {
        const previous = form.getValues('image')

        form.setValue('image', [
          ...previous,
          ...data.map((item) => ({
            id: item.file.id,
            uri: item.asset.uri,
            url: item.file.url,
          })),
        ])
      }
    },
  })

  const images = useFieldArray({
    control: form.control,
    name: 'image',
  })

  const errors = form.getErrors('image')

  return (
    <View style={styles.main}>
      {errors?.length ? (
        <Text color="red" mt="3" mx="4" size="2">
          {errors[0]?.message}
        </Text>
      ) : null}

      <Controller
        control={form.control}
        name="image"
        render={({ field }) => (
          <Focusable
            onFocus={() => {
              mutate()
            }}
            ref={field.ref}
          />
        )}
      />

      <ScrollView contentContainerStyle={styles.content} horizontal>
        {images.fields.map((field, index) => (
          <View key={field.id} style={styles.item}>
            <Image
              accessibilityIgnoresInvertColors
              source={field.uri}
              style={styles.image}
            />

            <Pressable
              accessibilityLabel={t('remove')}
              onPress={() => {
                images.remove(index)
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
        ))}

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
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  content: {
    gap: theme.space[4],
    padding: theme.space[4],
  },
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
  },
  upload: {
    alignItems: 'center',
    backgroundColor: theme.colors.accent.accent,
    justifyContent: 'center',
  },
}))
