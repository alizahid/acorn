import { addHours, fromUnixTime } from 'date-fns'
// biome-ignore lint/performance/noNamespaceImport: go away
import * as SecureStore from 'expo-secure-store'
import { type VideoSource } from 'react-native-jet-video'
import { z } from 'zod'

import { getUserAgent } from './user-agent'

const GifSchema = z.object({
  gif: z.object({
    id: z.string(),
    urls: z.object({
      hd: z.string().optional(),
      poster: z.string().optional(),
      sd: z.string().optional(),
    }),
  }),
})

export type Gif = {
  expiresAt: Date
  poster?: string
  source: VideoSource
  url: string
}

export async function getGif(id: string, retry = true): Promise<Gif> {
  const url = new URL(`/v2/gifs/${id}`, 'https://api.redgifs.com')

  const token = await getTemporaryToken()

  const response = await fetch(url, {
    headers: {
      authorization: `Bearer ${token}`,
      'user-agent': getUserAgent(true),
    },
  })

  if (response.status === 401 && retry) {
    await SecureStore.deleteItemAsync(KEY)

    return getGif(id, false)
  }

  if (response.status !== 200) {
    await throwError(response)
  }

  const json = await response.json()

  const { gif } = GifSchema.parse(json)

  const source = gif.urls.hd ?? gif.urls.sd

  if (!source) {
    throw new Error(`No video url for gif ${id}`)
  }

  const uri = new URL(source)

  const expires = Number(uri.searchParams.get('expires')) || 0

  return {
    expiresAt: fromUnixTime(expires - 1000 * 60),
    poster: gif.urls.poster,
    source: {
      headers: {
        authorization: `Bearer ${token}`,
        'user-agent': getUserAgent(true),
      },
      uri: uri.toString(),
    },
    url: uri.toString(),
  }
}

const KEY = 'redgifs_token'

const TokenSchema = z.object({
  expiresAt: z.date(),
  token: z.string(),
})

type TokenPayload = z.infer<typeof TokenSchema>

async function getTemporaryToken() {
  const token = await SecureStore.getItemAsync(KEY)

  if (!token) {
    return generateToken()
  }

  const result = TokenSchema.safeParse(JSON.parse(token))

  if (!result.success) {
    return generateToken()
  }

  if (new Date() > result.data.expiresAt) {
    return generateToken()
  }

  return result.data.token
}

const TemporaryTokenSchema = z.object({
  token: z.string(),
})

type TemporaryTokenPayload = z.infer<typeof TemporaryTokenSchema>

async function generateToken() {
  const url = new URL('/v2/auth/temporary', 'https://api.redgifs.com')

  const response = await fetch(url, {
    headers: {
      'user-agent': getUserAgent(true),
    },
  })

  if (response.status !== 200) {
    await throwError(response)
  }

  const json = (await response.json()) as TemporaryTokenPayload

  const { token } = TemporaryTokenSchema.parse(json)

  await SecureStore.setItemAsync(
    KEY,
    JSON.stringify({
      expiresAt: addHours(new Date(), 23),
      token,
    } satisfies TokenPayload),
  )

  return token
}

async function throwError(response: Response): Promise<never> {
  try {
    const json = (await response.json()) as {
      error?: {
        description?: string
      }
      reason?: string
    }

    throw new Error(
      json.error?.description ?? json.reason ?? response.statusText,
    )
  } catch (error) {
    throw new Error(response.statusText, {
      cause: error,
    })
  }
}
