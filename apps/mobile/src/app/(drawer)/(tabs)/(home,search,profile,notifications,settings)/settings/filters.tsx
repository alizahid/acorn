import { createId } from '@paralleldrive/cuid2'
import { useFocusEffect, useNavigation } from 'expo-router'
import { useCallback } from 'react'
import { FormProvider, useFieldArray } from 'react-hook-form'
import { FlatList } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { FloatingButton } from '~/components/common/floating-button'
import { Icon } from '~/components/common/icon'
import { IconButton } from '~/components/common/icon/button'
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
  const a11y = useTranslations('a11y')

  const listProps = useList()

  const { form, isPending, onSubmit, update } = useFilters()

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerRight: () => (
          <IconButton
            icon="checkmark.circle.fill"
            label={a11y('saveFilters')}
            loading={isPending}
            onPress={() => {
              onSubmit()
            }}
          />
        ),
      })
    }, [a11y, isPending, navigation, onSubmit]),
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
        contentContainerStyle={styles.content}
        data={filters.fields}
        ItemSeparatorComponent={() => <View height="4" />}
        keyExtractor={(item) => item.key}
        ListHeaderComponent={
          <View gap="2" mb="4">
            {[
              {
                label: t('rules.yes.1'),
                type: 'yes',
              },
              {
                label: t('rules.yes.2'),
                type: 'yes',
              },
              {
                label: t('rules.no.1'),
                type: 'no',
              },
              {
                label: t('rules.no.2'),
                type: 'no',
              },
              {
                label: t('rules.no.3'),
                type: 'no',
              },
              {
                label: t('rules.info.1'),
                type: 'info',
              },
            ].map((rule) => (
              <View align="center" direction="row" gap="2" key={rule.label}>
                <Icon
                  name={
                    rule.type === 'yes'
                      ? 'checkmark.circle.fill'
                      : rule.type === 'no'
                        ? 'xmark.circle.fill'
                        : 'info.circle.fill'
                  }
                  uniProps={(theme) => ({
                    size: theme.typography[2].lineHeight,
                    tintColor:
                      rule.type === 'yes'
                        ? theme.colors.green.accent
                        : rule.type === 'no'
                          ? theme.colors.red.accent
                          : theme.colors.blue.accent,
                  })}
                />

                <Text size="2" style={styles.rule}>
                  {rule.label}
                </Text>
              </View>
            ))}
          </View>
        }
        renderItem={({ index }) => (
          <FilterCard index={index} onRemove={filters.remove} />
        )}
        renderScrollComponent={(props) => (
          <KeyboardAwareScrollView
            {...props}
            bottomOffset={16}
            ScrollViewComponent={ScrollView}
          />
        )}
      />

      <FloatingButton
        color="red"
        icon="xmark"
        label={a11y('clearFilters')}
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
        icon="plus"
        label={a11y('addFilter')}
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

const styles = StyleSheet.create((theme) => ({
  content: {
    padding: theme.space[4],
    paddingBottom: heights.floatingButton,
  },
  rule: {
    flex: 1,
  },
}))
