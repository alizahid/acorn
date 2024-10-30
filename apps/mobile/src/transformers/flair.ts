import { createId } from '@paralleldrive/cuid2'

import { type FlairSchema } from '~/schemas/flair'
import { type Flair } from '~/types/flair'

export function transformFlair(data?: FlairSchema | null): Array<Flair> {
  if (!data) {
    return []
  }

  return data
    .map((flair) => ({
      id: createId(),
      type: flair.e,
      value: (flair.e === 'emoji' ? flair.u : flair.t).trim(),
    }))
    .filter((flair) => flair.value.length > 0)
}
