import type en from '~/intl/en.json'

type Messages = typeof en

declare global {
  // eslint-disable-next-line ts/consistent-type-definitions
  interface IntlMessages extends Messages {}
}
