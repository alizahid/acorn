import { createId } from '@paralleldrive/cuid2'
import { useFocusEffect, useNavigation } from 'expo-router'
import { useCallback } from 'react'
import { FormProvider, useFieldArray } from 'react-hook-form'
import { FlatList, View } from 'react-native'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { FloatingButton } from '~/components/common/floating-button'
import { Icon } from '~/components/common/icon'
import { IconButton } from '~/components/common/icon/button'
import { Text } from '~/components/common/text'
import { FilterCard } from '~/components/filters/card'
import { useFilters } from '~/hooks/filters'
import { heights } from '~/lib/common'
import { listProps } from '~/lib/list'

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

  const { form, isPending, onSubmit, update } = useFilters()

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerRight: () => (
          <IconButton
            icon="checkmark"
            label={a11y('saveFilters')}
            loading={isPending}
            onPress={() => {
              onSubmit()
            }}
            size="6"
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
      <KeyboardAvoidingView
        automaticOffset
        behavior="padding"
        keyboardVerticalOffset={16}
        style={styles.main}
      >
        <FlatList
          {...listProps}
          contentContainerStyle={styles.content}
          data={filters.fields}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          keyExtractor={(item) => item.key}
          ListHeaderComponent={
            <View style={styles.header}>
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
                <View key={rule.label} style={styles.headerItem}>
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
        />
      </KeyboardAvoidingView>

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
  header: {
    gap: theme.space[2],
    marginBottom: theme.space[4],
  },
  headerItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[2],
  },
  main: {
    flex: 1,
  },
  rule: {
    flex: 1,
  },
  separator: {
    height: theme.space[4],
  },
}))
