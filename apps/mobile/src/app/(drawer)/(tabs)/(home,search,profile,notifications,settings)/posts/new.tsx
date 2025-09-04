import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useCallback } from 'react'
import { Controller, FormProvider } from 'react-hook-form'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { IconButton } from '~/components/common/icon/button'
import { Loading } from '~/components/common/loading'
import { RefreshControl } from '~/components/common/refresh-control'
import { View } from '~/components/common/view'
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
import { useSubmission } from '~/hooks/queries/communities/submission'
import { heights } from '~/lib/common'
import { type Submission } from '~/types/submission'

const schema = z.object({
  name: z.string().catch('acornblue'),
})

export default function Screen() {
  const params = schema.parse(useLocalSearchParams())

  const { refetch, submission } = useSubmission(params.name)

  if (!submission) {
    return <Loading />
  }

  return <Content refetch={refetch} submission={submission} />
}

type Props = {
  refetch: () => Promise<unknown>
  submission: Submission
}

function Content({ refetch, submission }: Props) {
  const insets = useSafeAreaInsets()

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
            icon={{
              name: 'PaperPlaneTilt',
            }}
            label={a11y('createPost')}
            loading={isPending}
            onPress={() => {
              onSubmit()
            }}
          />
        ),
      })
    }, [a11y, isPending, navigation, onSubmit]),
  )

  return (
    <FormProvider {...form}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.content}
        extraKeyboardSpace={0 - insets.bottom - 110}
        keyboardDismissMode="interactive"
        refreshControl={<RefreshControl onRefresh={refetch} />}
        style={styles.main}
      >
        <View direction="row" gap="4" justify="between" mx="4">
          <SubmissionCommunityCard community={submission.community} />

          <SubmissionType submission={submission} />
        </View>

        <View flexGrow={1} my="4">
          <SubmissionTitle />

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
        </View>

        <View gap="4" mx="4">
          <SubmissionFlair submission={submission} />

          <SubmissionMeta />
        </View>
      </KeyboardAwareScrollView>
    </FormProvider>
  )
}

const styles = StyleSheet.create((theme, runtime) => ({
  content: {
    flexGrow: 1,
    paddingVertical: theme.space[4],
  },
  main: {
    flex: 1,
    marginBottom: heights.tabBar + runtime.insets.bottom,
    marginTop: heights.header + runtime.insets.top,
  },
}))
