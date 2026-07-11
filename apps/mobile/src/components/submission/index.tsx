import { useFocusEffect, useNavigation, useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import { Controller, FormProvider } from 'react-hook-form'
import { View } from 'react-native'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { useShallow } from 'zustand/react/shallow'

import { IconButton } from '~/components/common/icon/button'
import { SubmissionCommunityCard } from '~/components/submission/community'
import { SubmissionFlair } from '~/components/submission/flair'
import { SubmissionImage } from '~/components/submission/image'
import { SubmissionLink } from '~/components/submission/link'
import { SubmissionMeta } from '~/components/submission/meta'
import { SubmissionText } from '~/components/submission/text'
import { SubmissionTitle } from '~/components/submission/title'
import { useCreatePost } from '~/hooks/mutations/posts/create'
import { heights } from '~/lib/common'
import { useAuth } from '~/stores/auth'
import { type Submission } from '~/types/submission'

import { Icon } from '../common/icon'
import { Spinner } from '../common/spinner'
import { SubmissionType } from './type'

type Props = {
  submission: Submission
}

export function Submission({ submission }: Props) {
  const router = useRouter()
  const navigation = useNavigation()

  const a11y = useTranslations('a11y')

  const { accountId } = useAuth(
    useShallow((state) => ({
      accountId: state.accountId,
    })),
  )

  const { createPost, form, types, isPending } = useCreatePost(submission)

  const [uploading, setUploading] = useState(false)

  const onSubmit = form.handleSubmit(async (data) => {
    if (isPending) {
      return
    }

    const response = await createPost(data)

    if (response?.id) {
      router.replace({
        params: {
          id: response.id,
        },
        pathname: '/posts/[id]',
      })
    } else if (accountId) {
      router.replace({
        params: {
          name: accountId,
          type: 'submitted',
        },
        pathname: '/users/[name]/[type]',
      })
    }

    form.reset()
  })

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerRight: () =>
          uploading ? null : (
            <IconButton
              disabled={isPending}
              label={a11y('createPost')}
              onPress={() => {
                onSubmit()
              }}
            >
              {isPending ? <Spinner /> : <Icon name="paper-plane-tilt" />}
            </IconButton>
          ),
      })
    }, [a11y, isPending, navigation, onSubmit, uploading]),
  )

  return (
    <FormProvider {...form}>
      <View style={styles.header}>
        <SubmissionCommunityCard community={submission.community} />

        <SubmissionType types={types} />
      </View>

      <SubmissionTitle />

      <KeyboardAvoidingView behavior="padding" style={styles.content}>
        <Controller
          control={form.control}
          name="type"
          render={({ field }) =>
            field.value === 'image' || field.value === 'video' ? (
              <SubmissionImage
                onStatusChange={setUploading}
                type={field.value}
              />
            ) : field.value === 'link' ? (
              <SubmissionLink />
            ) : (
              <SubmissionText />
            )
          }
        />
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <SubmissionFlair submission={submission} />

        <SubmissionMeta />
      </View>
    </FormProvider>
  )
}

const styles = StyleSheet.create((theme, runtime) => ({
  content: {
    flex: 1,
  },
  footer: {
    gap: theme.space[4],
    paddingBottom: heights.tabBar + runtime.insets.bottom + theme.space[4],
    paddingHorizontal: theme.space[4],
    paddingTop: theme.space[4],
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: theme.space[4],
    justifyContent: 'space-between',
    paddingBottom: theme.space[4],
    paddingHorizontal: theme.space[4],
    paddingTop:
      heights.header + runtime.insets.top + theme.space[4] + theme.space[4],
  },
}))
