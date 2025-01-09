import { addHours, fromUnixTime } from 'date-fns'
import * as SecureStore from 'expo-secure-store'
import { type VideoSource } from 'expo-video'
import { z } from 'zod'

import { USER_AGENT } from '~/reddit/config'

const GifSchema = z.object({
  gif: z.object({
    id: z.string(),
    urls: z.object({
      hd: z.string(),
    }),
  }),
})

type GifPayload = z.infer<typeof GifSchema>

export type Gif = {
  expiresAt: Date
  source: VideoSource
}

export async function getGif(id: string): Promise<Gif> {
  const url = new URL(`/v2/gifs/${id}`, 'https://api.redgifs.com')

  const token = await getTemporaryToken()

  const response = await fetch(url, {
    headers: {
      authorization: `Bearer ${token}`,
      'user-agent': USER_AGENT,
    },
  })

  if (response.status !== 200) {
    const json = (await response.json()) as {
      reason: string
    }

    throw new Error(json.reason)
  }

  const json = (await response.json()) as GifPayload

  const { gif } = GifSchema.parse(json)

  const uri = new URL(gif.urls.hd)

  const expires = Number(uri.searchParams.get('expires')) || 0

  return {
    expiresAt: fromUnixTime(expires - 1_000 * 60),
    source: {
      headers: {
        authorization: `Bearer ${token}`,
        'user-agent': USER_AGENT,
      },
      uri: uri.toString(),
    },
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
      'user-agent': USER_AGENT,
    },
  })

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
