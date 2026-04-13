import { useFocusEffect, useNavigation, useRouter } from 'expo-router'
import { useCallback } from 'react'
import { Controller, FormProvider } from 'react-hook-form'
import { View } from 'react-native'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { IconButton } from '~/components/common/icon/button'
import { SubmissionCommunityCard } from '~/components/submission/community'
import { SubmissionFlair } from '~/components/submission/flair'
import { SubmissionImage } from '~/components/submission/image'
import { SubmissionLink } from '~/components/submission/link'
import { SubmissionMeta } from '~/components/submission/meta'
import { SubmissionText } from '~/components/submission/text'
import { SubmissionTitle } from '~/components/submission/title'
import { SubmissionType } from '~/components/submission/type'
import { useLink } from '~/hooks/link'
import { useCreatePost } from '~/hooks/mutations/posts/create'
import { heights, iOS26 } from '~/lib/common'
import { type Submission } from '~/types/submission'

type Props = {
  submission: Submission
}

export function Submission({ submission }: Props) {
  const router = useRouter()
  const navigation = useNavigation()

  const a11y = useTranslations('a11y')

  const { handleLink } = useLink()

  const { createPost, form, isPending } = useCreatePost(submission)

  const onSubmit = form.handleSubmit(async (data) => {
    if (isPending) {
      return
    }

    const response = await createPost(data)

    if ('id' in response) {
      router.replace({
        params: {
          id: response.id,
        },
        pathname: '/posts/[id]',
      })
    } else {
      handleLink(response.url)
    }

    form.reset()
  })

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerRight: () => (
          <IconButton
            icon="paperplane.fill"
            label={a11y('createPost')}
            loading={isPending}
            onPress={() => {
              onSubmit()
            }}
            size="6"
          />
        ),
      })
    }, [a11y, isPending, navigation, onSubmit]),
  )

  return (
    <FormProvider {...form}>
      <View style={styles.header}>
        <SubmissionCommunityCard community={submission.community} />

        <SubmissionType submission={submission} />
      </View>

      <SubmissionTitle />

      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={iOS26 ? -28 : 52}
        style={styles.content}
      >
        <Controller
          control={form.control}
          name="type"
          render={({ field }) =>
            field.value === 'image' ? (
              <SubmissionImage />
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
    flexDirection: 'row',
    gap: theme.space[4],
    justifyContent: 'space-between',
    paddingBottom: theme.space[4],
    paddingHorizontal: theme.space[4],
    paddingTop: iOS26
      ? heights.header + runtime.insets.top + theme.space[4]
      : theme.space[4],
  },
}))
