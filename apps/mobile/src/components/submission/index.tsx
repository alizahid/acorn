import { Stack, useRouter } from 'expo-router'
import { useHeaderHeight } from 'expo-router/react-navigation'
import { useState } from 'react'
import { Controller, FormProvider } from 'react-hook-form'
import { View } from 'react-native'
import { useBottomTabBarHeight } from 'react-native-bottom-tabs'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { useShallow } from 'zustand/react/shallow'

import { SubmissionCommunityCard } from '~/components/submission/community'
import { SubmissionFlair } from '~/components/submission/flair'
import { SubmissionImage } from '~/components/submission/image'
import { SubmissionLink } from '~/components/submission/link'
import { SubmissionMeta } from '~/components/submission/meta'
import { SubmissionText } from '~/components/submission/text'
import { SubmissionTitle } from '~/components/submission/title'
import { useCreatePost } from '~/hooks/mutations/posts/create'
import { useAuth } from '~/stores/auth'
import { type Submission } from '~/types/submission'

import { Icon } from '../common/icon'
import { IconButton } from '../common/icon/button'
import { Spinner } from '../common/spinner'
import { SubmissionType } from './type'

type Props = {
  submission: Submission
}

export function Submission({ submission }: Props) {
  const router = useRouter()
  const headerHeight = useHeaderHeight()
  const tabBarHeight = useBottomTabBarHeight()

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

  return (
    <FormProvider {...form}>
      {uploading ? null : (
        <Stack.Toolbar placement="right">
          <Stack.Toolbar.View>
            <IconButton
              disabled={isPending}
              header
              label={a11y('createPost')}
              onPress={() => {
                onSubmit()
              }}
            >
              {isPending ? <Spinner /> : <Icon name="paper-plane-tilt-fill" />}
            </IconButton>
          </Stack.Toolbar.View>
        </Stack.Toolbar>
      )}

      <View style={styles.header(headerHeight)}>
        <SubmissionCommunityCard community={submission.community} />

        <SubmissionType types={types} />
      </View>

      <SubmissionTitle />

      <KeyboardAwareScrollView
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        style={styles.content}
      >
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
      </KeyboardAwareScrollView>

      <View style={styles.footer(tabBarHeight)}>
        <SubmissionFlair submission={submission} />

        <SubmissionMeta />
      </View>
    </FormProvider>
  )
}

const styles = StyleSheet.create((theme) => ({
  content: {
    flex: 1,
  },
  footer: (tabBarHeight: number) => ({
    gap: theme.space[4],
    padding: theme.space[4],
    paddingBottom: tabBarHeight + theme.space[4],
  }),
  header: (headerHeight: number) => ({
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[4],
    justifyContent: 'space-between',
    padding: theme.space[4],
    paddingTop: headerHeight + theme.space[4],
  }),
}))
