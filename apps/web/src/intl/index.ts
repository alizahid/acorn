import { getRequestConfig } from 'next-intl/server'

import messages from './en.json'

export default getRequestConfig(() => ({
  locale: 'en',
  messages,
}))
