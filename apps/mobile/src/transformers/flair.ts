import { createId } from '@paralleldrive/cuid2'

import { type FlairSchema } from '~/schemas/flair'
import { type Nullable } from '~/types'
import { type Flair } from '~/types/flair'

export function transformFlair(data?: Nullable<FlairSchema>): Array<Flair> {
  if (!data) {
    return []
  }

  return data
    .map((flair) => ({
      id: createId(),
      type: flair.e,
      value: flair.e === 'emoji' ? flair.u : flair.t,
    }))
    .filter((flair) => flair.value.length > 0)
}
