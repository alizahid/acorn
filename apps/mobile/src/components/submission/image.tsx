import { useMutation } from '@tanstack/react-query'
import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'
import { useCallback, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { StyleSheet } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { type CreatePostForm } from '~/hooks/mutations/posts/create'
import { uploadFile } from '~/reddit/media'
import { type Undefined } from '~/types'

import { Focusable } from '../common/focusable'
import { Icon } from '../common/icon'
import { IconButton } from '../common/icon-button'
import { Pressable } from '../common/pressable'
import { Spinner } from '../common/spinner'
import { Text } from '../common/text'
import { View } from '../common/view'

export function SubmissionImage() {
  const t = useTranslations('component.submission.image')

  const { styles, theme } = useStyles(stylesheet)

  const { control, setValue } = useFormContext<CreatePostForm>()

  const [image, setImage] = useState<ImagePicker.ImagePickerAsset>()

  const { isPending, mutate } = useMutation<
    Undefined<string>,
    Error,
    ImagePicker.ImagePickerAsset
  >({
    mutationFn(variables) {
      return uploadFile(variables)
    },
    onSuccess(data) {
      if (data) {
        setValue('url', data)
      }
    },
  })

  const onPress = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync()

    if (!result.assets?.[0]) {
      return
    }

    setImage(result.assets[0])
    mutate(result.assets[0])
  }, [mutate])

  return (
    <Controller
      control={control}
      name="url"
      render={({ field }) => (
        <Pressable disabled={isPending} flex={1} onPress={onPress}>
          <Focusable onFocus={onPress} ref={field.ref} />

          {image ? (
            <>
              <Image source={image.uri} style={styles.image} />

              {isPending ? (
                <View align="center" justify="center" style={styles.loading}>
                  <Spinner size="large" />
                </View>
              ) : null}

              <IconButton
                icon={{
                  color: 'red',
                  name: 'Trash',
                  weight: 'bold',
                }}
                onPress={() => {
                  setImage(undefined)
                }}
                style={styles.delete}
              />
            </>
          ) : (
            <View align="center" flex={1} gap="4" justify="center">
              <Icon
                color={theme.colors.accent.accent}
                name="Image"
                size={theme.space[9]}
                weight="duotone"
              />

              <Text weight="medium">{t('placeholder')}</Text>
            </View>
          )}
        </Pressable>
      )}
    />
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
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
    ...StyleSheet.absoluteFillObject,
  },
}))
