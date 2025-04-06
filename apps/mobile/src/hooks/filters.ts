import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { inArray } from 'drizzle-orm'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'
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
  const t = useTranslations('toasts.filters')

  const form = useForm({
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

      if (variables.filters.length > 0) {
        await db.insert(db.schema.filters).values(variables.filters)
      }

      return true
    },
    onSuccess() {
      toast.success(t('updated'))
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
