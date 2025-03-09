import { createId } from '@paralleldrive/cuid2'
import { useFocusEffect, useNavigation } from 'expo-router'
import { useCallback } from 'react'
import { FormProvider, useFieldArray } from 'react-hook-form'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { FloatingButton } from '~/components/common/floating-button'
import { Icon } from '~/components/common/icon'
import { IconButton } from '~/components/common/icon-button'
import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
import { FilterCard } from '~/components/filters/card'
import { useFilters } from '~/hooks/filters'
import { useList } from '~/hooks/list'

const schema = z.object({
  filters: z.array(
    z.object({
      id: z.string(),
      type: z.enum(['keyword', 'community', 'user', 'post']),
      value: z.string().min(1),
    }),
  ),
})

export type Form = z.infer<typeof schema>

export default function Screen() {
  const navigation = useNavigation()

  const t = useTranslations('screen.settings.filters')

  const { styles, theme } = useStyles(stylesheet)

  const listProps = useList()

  const { form, isPending, onSubmit, update } = useFilters()

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerRight: () => (
          <IconButton
            icon={{
              name: 'FloppyDisk',
              weight: 'duotone',
            }}
            loading={isPending}
            onPress={async () => {
              await onSubmit()

              toast.success(t('message.saved'))
            }}
          />
        ),
      })
    }, [isPending, navigation, onSubmit, t]),
  )

  const filters = useFieldArray({
    control: form.control,
    keyName: 'key',
    name: 'filters',
  })

  return (
    <FormProvider {...form}>
      <KeyboardAwareScrollView
        {...listProps}
        automaticallyAdjustKeyboardInsets
        bottomOffset={-120}
        contentContainerStyle={styles.content}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        <View gap="2">
          {[
            {
              label: t('rules.yes.one'),
              type: 'yes',
            },
            {
              label: t('rules.yes.two'),
              type: 'yes',
            },
            {
              label: t('rules.no.one'),
              type: 'no',
            },
            {
              label: t('rules.no.two'),
              type: 'no',
            },
            {
              label: t('rules.no.three'),
              type: 'no',
            },
            {
              label: t('rules.info.one'),
              type: 'info',
            },
          ].map((rule) => (
            <View align="center" direction="row" gap="2" key={rule.label}>
              <Icon
                color={
                  rule.type === 'yes'
                    ? theme.colors.green.accent
                    : rule.type === 'no'
                      ? theme.colors.red.accent
                      : theme.colors.blue.accent
                }
                name={
                  rule.type === 'yes'
                    ? 'CheckCircle'
                    : rule.type === 'no'
                      ? 'XCircle'
                      : 'Info'
                }
                size={theme.typography[2].lineHeight}
                weight="fill"
              />

              <Text size="2" style={styles.rule}>
                {rule.label}
              </Text>
            </View>
          ))}
        </View>

        <View gap="4" mt="6">
          {filters.fields.map((item, index) => (
            <FilterCard
              index={index}
              key={item.key}
              onRemove={filters.remove}
            />
          ))}
        </View>
      </KeyboardAwareScrollView>

      <FloatingButton
        color="red"
        icon="X"
        onPress={async () => {
          form.setValue('filters', [])

          await update({
            filters: [],
          })

          toast.success(t('message.cleared'))
        }}
        side="left"
      />

      <FloatingButton
        color="green"
        icon="Plus"
        onPress={() => {
          filters.append({
            id: createId(),
            type: 'keyword',
            value: '',
          })
        }}
        side="right"
      />
    </FormProvider>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  content: {
    padding: theme.space[4],
    paddingBottom: theme.space[8] + theme.space[4] + theme.space[4],
  },
  rule: {
    flex: 1,
  },
}))
