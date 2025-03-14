import { createId } from '@paralleldrive/cuid2'
import { useFocusEffect, useNavigation } from 'expo-router'
import { useCallback } from 'react'
import { FormProvider, useFieldArray } from 'react-hook-form'
import { FlatList } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
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
import { heights } from '~/lib/common'

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
            onPress={() => {
              void onSubmit()
            }}
          />
        ),
      })
    }, [isPending, navigation, onSubmit]),
  )

  const filters = useFieldArray({
    control: form.control,
    keyName: 'key',
    name: 'filters',
  })

  return (
    <FormProvider {...form}>
      <FlatList
        {...listProps}
        ItemSeparatorComponent={() => <View height="4" />}
        ListHeaderComponent={
          <View gap="2" mb="4">
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
        }
        contentContainerStyle={styles.content}
        data={filters.fields}
        keyExtractor={(item) => item.key}
        renderItem={({ index }) => (
          <FilterCard index={index} onRemove={filters.remove} />
        )}
        renderScrollComponent={(props) => (
          <KeyboardAwareScrollView {...props} bottomOffset={16} />
        )}
      />

      <FloatingButton
        color="red"
        icon="X"
        onPress={() => {
          form.setValue('filters', [])

          update({
            filters: [],
          })
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
    paddingBottom: heights.floatingButton,
  },
  rule: {
    flex: 1,
  },
}))
