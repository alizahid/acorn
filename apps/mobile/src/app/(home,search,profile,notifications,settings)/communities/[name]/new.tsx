import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from 'expo-router'
import { useCallback } from 'react'
import { FormProvider } from 'react-hook-form'
import { ScrollView } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { z } from 'zod'

import { IconButton } from '~/components/common/icon-button'
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
import { useList } from '~/hooks/list'
import { useCreatePost } from '~/hooks/mutations/posts/create'
import { useSubmission } from '~/hooks/queries/communities/submission'
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
  const router = useRouter()
  const navigation = useNavigation()

  const { styles, theme } = useStyles(stylesheet)

  const { handleLink } = useLink()

  const listProps = useList({
    padding: {
      vertical: theme.space[4],
    },
  })

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
      void handleLink(response.url)
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
            loading={isPending}
            onPress={() => {
              void onSubmit()
            }}
          />
        ),
      })
    }, [isPending, navigation, onSubmit]),
  )

  const type = form.watch('type')

  return (
    <FormProvider {...form}>
      <ScrollView
        {...listProps}
        contentContainerStyle={[
          listProps.contentContainerStyle,
          styles.content,
        ]}
        refreshControl={
          <RefreshControl
            offset={listProps.progressViewOffset}
            onRefresh={refetch}
          />
        }
      >
        <View direction="row" gap="4" justify="between" mx="4">
          <SubmissionCommunityCard community={submission.community} />

          <SubmissionType submission={submission} />
        </View>

        <View flex={1}>
          <SubmissionTitle />

          {type === 'image' ? (
            <SubmissionImage />
          ) : type === 'link' ? (
            <SubmissionLink />
          ) : (
            <SubmissionText />
          )}
        </View>

        <View gap="4" mt="auto" mx="4">
          <SubmissionFlair submission={submission} />

          <SubmissionMeta />
        </View>
      </ScrollView>
    </FormProvider>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  content: {
    flexGrow: 1,
    gap: theme.space[4],
  },
}))
