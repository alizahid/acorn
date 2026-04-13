import { notFound } from 'next/navigation'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const typeSchema = z.enum(['original', 'downsized']).catch('original')

const giphySchema = z.object({
  data: z.object({
    images: z.object({
      downsized: z.object({
        url: z.url(),
      }),
      original: z.object({
        url: z.url(),
      }),
    }),
  }),
})

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')
  const type = typeSchema.parse(request.nextUrl.searchParams.get('type'))

  if (!id) {
    notFound()
  }

  const response = await fetch(
    `https://api.giphy.com/v1/gifs/${id}?api_key=${process.env.GIPHY_API_KEY}`,
  )

  const json = await response.json()

  const result = giphySchema.safeParse(json)

  if (!result.success) {
    notFound()
  }

  return NextResponse.redirect(result.data.data.images[type].url)
}
