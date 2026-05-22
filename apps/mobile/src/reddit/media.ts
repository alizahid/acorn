import { createId } from '@paralleldrive/cuid2'
import { fetch } from 'expo/fetch'
import { File } from 'expo-file-system'
import { type ImagePickerAsset } from 'expo-image-picker'
import { createVideoPlayer, type VideoThumbnail } from 'expo-video'
import { z } from 'zod'

import { getUserAgent } from '~/lib/user-agent'

import { getAuth, REDDIT_URI } from './api'

const uploadFileRegex = /<Location>(.*?)<\/Location>/

export async function uploadFile(asset: ImagePickerAsset) {
  const { mediaId, uploadLease } = await fetchLease(asset)

  const body = new FormData()

  for (const field of uploadLease.uploadLeaseHeaders) {
    body.append(field.header, field.value)
  }

  const file = new File(asset.uri)

  body.append('file', file, asset.fileName ?? undefined)

  const headers = new Headers()

  headers.set('content-type', 'multipart/form-data')

  const response = await fetch(uploadLease.uploadLeaseUrl, {
    body,
    headers,
    method: 'post',
  })

  const xml = await response.text()

  const matches = uploadFileRegex.exec(xml)

  return {
    mediaId,
    url: matches?.[1],
  }
}

const LeaseSchema = z.object({
  data: z.object({
    createMediaUploadLease: z.object({
      mediaId: z.string(),
      ok: z.boolean(),
      uploadLease: z.object({
        uploadLeaseHeaders: z.array(
          z.object({
            header: z.string(),
            value: z.string(),
          }),
        ),
        uploadLeaseUrl: z.string(),
      }),
    }),
  }),
})

async function fetchLease(asset: ImagePickerAsset) {
  const mimetype = asset.mimeType?.split('/').pop()?.toUpperCase()

  if (!mimetype) {
    throw new Error('File type not allowed')
  }

  const auth = getAuth()

  if (!auth) {
    throw new Error('You need to be logged in')
  }

  const csrf = createId()

  const headers = new Headers()

  headers.set('cookie', `csrf_token=${csrf}; reddit_session=${auth.cookie}`)
  headers.set('user-agent', getUserAgent())
  headers.set('content-type', 'application/json')

  const url = new URL('/svc/shreddit/graphql', REDDIT_URI)

  const response = await fetch(url, {
    body: JSON.stringify({
      csrf_token: csrf,
      operation: 'CreateMediaUploadLease',
      variables: {
        input: {
          mimetype,
        },
      },
    }),
    credentials: 'omit',
    headers,
    method: 'post',
  })

  const json = await response.json()

  return LeaseSchema.parse(json).data.createMediaUploadLease
}

export async function generateVideoThumbnail(uri: string) {
  const player = createVideoPlayer(uri)

  if (player.status === 'readyToPlay') {
    const [thumbnail] = await player.generateThumbnailsAsync(0)

    if (!thumbnail) {
      player.release()

      return Promise.reject(new Error('Unable to generate thumbnail'))
    }

    return Promise.resolve(thumbnail)
  }

  if (player.status === 'error') {
    player.release()

    return Promise.reject(new Error('Video failed to load'))
  }

  return new Promise<VideoThumbnail>((resolve, reject) => {
    const subscription = player.addListener('statusChange', async (event) => {
      if (event.status === 'readyToPlay') {
        subscription.remove()

        const [thumbnail] = await player.generateThumbnailsAsync(0)

        if (!thumbnail) {
          player.release()

          reject(new Error('Unable to generate thumbnail'))

          return
        }

        player.release()

        resolve(thumbnail)
      }

      if (event.status === 'error') {
        subscription.remove()

        player.release()

        reject(event.error ?? new Error('Video failed to load'))
      }
    })
  })
}
