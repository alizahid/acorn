import { addHours } from 'date-fns'
import * as SecureStore from 'expo-secure-store'
import { z } from 'zod'

import { USER_AGENT } from './const'

const GifSchema = z.object({
  gif: z.object({
    id: z.string(),
    urls: z.object({
      hd: z.string(),
    }),
  }),
})

type GifPayload = z.infer<typeof GifSchema>

export async function getGif(id: string) {
  const url = new URL(`/v2/gifs/${id}`, 'https://api.redgifs.com')

  const response = await fetch(url, {
    headers: {
      authorization: `Bearer ${await getTemporaryToken()}`,
      'user-agent': USER_AGENT,
    },
  })

  const json = (await response.json()) as GifPayload

  return GifSchema.parse(json)
}

const NAME = 'red_gifs_token'

const TokenSchema = z.object({
  expiresAt: z.date(),
  token: z.string(),
})

type TokenPayload = z.infer<typeof TokenSchema>

async function getTemporaryToken() {
  const token = await SecureStore.getItemAsync(NAME)

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

  const response = await fetch(url)

  const json = (await response.json()) as TemporaryTokenPayload

  const { token } = TemporaryTokenSchema.parse(json)

  await SecureStore.setItemAsync(
    NAME,
    JSON.stringify({
      expiresAt: addHours(new Date(), 23),
      token,
    } satisfies TokenPayload),
  )

  return token
}
