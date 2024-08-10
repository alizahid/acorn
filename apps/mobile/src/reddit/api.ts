import { useAuth } from '~/stores/auth'

import { REDDIT_URI, USER_AGENT } from './config'

type Props = {
  accessToken?: string
  body?: FormData
  method?: 'get' | 'post'
  url: string | URL
}

export async function reddit<Response>({
  accessToken = useAuth.getState().accessToken,
  body,
  method = 'get',
  url,
}: Props) {
  if (!accessToken) {
    return null
  }

  const headers = new Headers()

  headers.set('authorization', `Bearer ${String(accessToken)}`)
  headers.set('user-agent', USER_AGENT)

  const request: RequestInit = {
    headers,
    method,
  }

  if (body) {
    request.body = body

    headers.set('content-type', 'multipart/form-data')
  }

  const input = new URL(url, REDDIT_URI)

  input.searchParams.set('g', 'GLOBAL')

  if (__DEV__) {
    // eslint-disable-next-line no-console -- dev
    console.log('reddit', input.toString())
  }

  const response = await fetch(input, request)

  return (await response.json()) as Response
}
