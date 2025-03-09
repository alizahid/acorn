import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { inArray } from 'drizzle-orm'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { db } from '~/db'

const schema = z.object({
  filters: z.array(
    z.object({
      id: z.string(),
      type: z.enum(['keyword', 'community', 'user', 'post']),
      value: z.string().min(1),
    }),
  ),
})

export type FiltersForm = z.infer<typeof schema>

export function useFilters() {
  const form = useForm<FiltersForm>({
    async defaultValues() {
      const filters = await db
        .select()
        .from(db.schema.filters)
        .where(
          inArray(db.schema.filters.type, ['keyword', 'community', 'user']),
        )

      return {
        filters,
      }
    },
    resolver: zodResolver(schema),
  })

  const { isPending, mutate } = useMutation<unknown, Error, FiltersForm>({
    async mutationFn(variables) {
      await db.delete(db.schema.filters)

      await db.insert(db.schema.filters).values(variables.filters)
    },
  })

  const onSubmit = form.handleSubmit((data) => {
    mutate(data)
  })

  return {
    form,
    isPending,
    onSubmit,
    update: mutate,
  }
}
