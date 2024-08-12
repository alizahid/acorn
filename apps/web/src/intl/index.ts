import { getRequestConfig } from 'next-intl/server'

import messages from './en.json'

export default getRequestConfig(() => {
  const locale = 'en'

  return {
    locale,
    messages,
  }
})
