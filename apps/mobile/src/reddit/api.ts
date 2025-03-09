import { getAccount, updateAccounts, useAuth } from '~/stores/auth'

import { REDDIT_URI, USER_AGENT } from './config'
import { refreshAccessToken } from './token'

type Props = {
  accessToken?: string
  body?: FormData
  method?: 'get' | 'post'
  url: string | URL
}

export async function reddit<Response>({
  accessToken,
  body,
  method = 'get',
  url,
}: Props) {
  let token = accessToken ?? useAuth.getState().accessToken

  if (!token) {
    return
  }

  const expired = checkExpiry(Boolean(accessToken))

  if (expired) {
    token = await refresh()
  }

  if (!token) {
    return
  }

  const headers = new Headers()

  headers.set('authorization', `Bearer ${String(token)}`)
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
    console.log('reddit', input.toString(), request)
  }

  const response = await fetch(input, request)

  if (url === '/api/read_all_messages') {
    return {} as Response
  }

  if (response.status >= 400) {
    const json = (await response.json()) as {
      message?: string
    }

    throw new Error(json.message ?? response.statusText)
  }

  return (await response.json()) as Response
}

function checkExpiry(skip?: boolean) {
  if (skip) {
    return false
  }

  const { accessToken, expiresAt, refreshToken } = useAuth.getState()

  if (!accessToken || !refreshToken || !expiresAt) {
    return true
  }

  return new Date() > expiresAt
}

async function refresh() {
  const { clientId, refreshToken } = useAuth.getState()

  if (!clientId || !refreshToken) {
    return
  }

  const payload = await refreshAccessToken(clientId, refreshToken)

  if (!payload) {
    return
  }

  useAuth.setState({
    ...getAccount(payload),
    accounts: updateAccounts(useAuth.getState().accounts, payload),
  })

  return payload.accessToken
}
