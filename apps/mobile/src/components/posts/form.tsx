import { Stack, useRouter } from 'expo-router'
import { useState } from 'react'
import { useWatch } from 'react-hook-form'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-screens/experimental'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { useShallow } from 'zustand/react/shallow'

import { useAuth } from '~/stores/auth'

import { Icon } from '../common/icon'
import { IconButton } from '../common/icon/button'
import { Spinner } from '../common/spinner'
import { Submission } from '../submission'
import { useSubmission } from '../submission/provider'

export function PostForm() {
  const router = useRouter()

  const a11y = useTranslations('a11y')

  const { accountId } = useAuth(
    useShallow((state) => ({
      accountId: state.accountId,
    })),
  )

  const { submission, createPost, form, types, isPending } = useSubmission()

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

  const type = useWatch({
    control: form.control,
    name: 'type',
  })

  return (
    <SafeAreaView
      edges={{
        bottom: true,
        top: true,
      }}
    >
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.View>
          <IconButton
            accessibilityLabel={a11y('createPost')}
            disabled={uploading || isPending}
            header
            onPress={() => {
              onSubmit()
            }}
          >
            {isPending ? <Spinner /> : <Icon name="paper-plane-tilt-fill" />}
          </IconButton>
        </Stack.Toolbar.View>
      </Stack.Toolbar>

      <Submission.Community />

      <Submission.Title />

      {type === 'link' ? <Submission.Link /> : null}

      {type === 'image' ? (
        <Submission.Image onStatusChange={setUploading} />
      ) : null}

      {type === 'video' ? (
        <Submission.Video onStatusChange={setUploading} />
      ) : null}

      {submission.media.text ? <Submission.Text /> : null}

      <View style={styles.footer}>
        <Submission.Flair />

        <Submission.Meta types={types} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create((theme) => ({
  footer: {
    marginBottom: theme.space[4],
  },
}))
