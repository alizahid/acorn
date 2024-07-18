import type en from '~/intl/en.json'

type Messages = typeof en

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-empty-interface -- go away
  interface IntlMessages extends Messages {}
}
