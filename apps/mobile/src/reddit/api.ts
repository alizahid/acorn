import { updateAccounts, useAuth } from '~/stores/auth'

import { REDDIT_URI, USER_AGENT } from './config'
import { refreshAccessToken } from './token'

type Props = {
  body?: FormData
  method?: 'get' | 'post'
  url: string | URL
}

export async function reddit<Response>({ body, method = 'get', url }: Props) {
  const token = await getToken()

  if (!token) {
    return
  }

  const headers = new Headers()

  headers.set('authorization', `Bearer ${token}`)
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

async function getToken() {
  const { accountId, accounts } = useAuth.getState()

  if (!accountId) {
    return
  }

  const account = accounts.find((item) => item.id === accountId)

  if (!account) {
    return
  }

  if (new Date() > account.expiresAt) {
    const payload = await refreshAccessToken(account.refreshToken)

    if (!payload) {
      return
    }

    useAuth.setState({
      accountId: payload.id,
      accounts: updateAccounts(useAuth.getState().accounts, payload),
    })

    return payload.accessToken
  }

  return account.accessToken
}
