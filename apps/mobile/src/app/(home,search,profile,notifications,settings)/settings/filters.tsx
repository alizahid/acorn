import { zodResolver } from '@hookform/resolvers/zod'
import { useFocusEffect, useNavigation } from 'expo-router'
import { useCallback } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { FloatingButton } from '~/components/common/floating-button'
import { Icon } from '~/components/common/icon'
import { IconButton } from '~/components/common/icon-button'
import { Text } from '~/components/common/text'
import { TextBox } from '~/components/common/text-box'
import { View } from '~/components/common/view'
import { useList } from '~/hooks/list'
import { usePreferences } from '~/stores/preferences'

const schema = z.object({
  keywords: z.array(
    z.object({
      value: z.string().min(1),
    }),
  ),
})

type Form = z.infer<typeof schema>

export default function Screen() {
  const navigation = useNavigation()

  const t = useTranslations('screen.settings.filters')

  const { filteredKeywords, update } = usePreferences()

  const { styles, theme } = useStyles(stylesheet)

  const listProps = useList({
    padding: {
      bottom: theme.space[8] + theme.space[4] + theme.space[4],
      left: theme.space[4],
      right: theme.space[2],
      top: theme.space[4],
    },
  })

  const { control, handleSubmit, setValue } = useForm<Form>({
    defaultValues: (() => {
      const keywords = filteredKeywords.map((value) => ({
        value,
      }))

      if (keywords.length > 0) {
        return {
          keywords,
        }
      }

      return {
        keywords: [
          {
            value: '',
          },
        ],
      }
    })(),
    resolver: zodResolver(schema),
  })

  const onSubmit = handleSubmit((data) => {
    update({
      filteredKeywords: data.keywords.map((keyword) => keyword.value),
    })
  })

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerRight: () => (
          <IconButton
            icon={{
              name: 'CheckCircle',
              weight: 'duotone',
            }}
            onPress={() => {
              void onSubmit()
            }}
          />
        ),
      })
    }, [navigation, onSubmit]),
  )

  const keywords = useFieldArray({
    control,
    name: 'keywords',
  })

  return (
    <>
      <KeyboardAwareScrollView
        {...listProps}
        automaticallyAdjustKeyboardInsets
        bottomOffset={-120}
        contentContainerStyle={[
          listProps.contentContainerStyle,
          styles.content,
        ]}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        <View gap="4">
          {(
            [
              {
                key: 'yes',
                rules: [0, 1],
              },
              {
                key: 'no',
                rules: [0, 1],
              },
            ] as const
          ).map((rule) => (
            <View gap="2" key={rule.key}>
              <Text highContrast={false} size="2">
                {t(`rules.${rule.key}.title`)}
              </Text>

              {rule.rules.map((index) => (
                <View align="center" direction="row" gap="2" key={index}>
                  <Icon
                    color={
                      rule.key === 'yes'
                        ? theme.colors.green.accent
                        : theme.colors.red.accent
                    }
                    name={rule.key === 'yes' ? 'CheckCircle' : 'XCircle'}
                    weight="fill"
                  />

                  <Text style={styles.rule}>
                    {t(`rules.${rule.key}.rules.${index}`)}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        <View gap="4" mt="6">
          {keywords.fields.map((item, index) => (
            <Controller
              control={control}
              key={item.id}
              name={`keywords.${index}.value`}
              render={({ field }) => (
                <View direction="row" style={styles.item}>
                  <TextBox
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    onChangeText={field.onChange}
                    placeholder={t('form.field.keyword.placeholder')}
                    ref={field.ref}
                    style={styles.input}
                    value={field.value}
                  />

                  <IconButton
                    contrast
                    icon={{
                      color: 'red',
                      name: 'Trash',
                      weight: 'duotone',
                    }}
                    onPress={() => {
                      keywords.remove(index)
                    }}
                    size="7"
                    style={styles.action}
                  />
                </View>
              )}
            />
          ))}
        </View>
      </KeyboardAwareScrollView>

      <FloatingButton
        color="red"
        icon="X"
        onPress={() => {
          update({
            filteredKeywords: [],
          })

          setValue('keywords', [
            {
              value: '',
            },
          ])
        }}
        side="left"
      />

      <FloatingButton
        color="green"
        icon="Plus"
        onPress={() => {
          keywords.append({
            value: '',
          })
        }}
        side="right"
      />
    </>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  action: {
    marginRight: -theme.space[1],
  },
  content: {
    flexGrow: 1,
  },
  input: {
    flex: 1,
  },
  item: {
    gap: theme.space[2],
  },
  rule: {
    flex: 1,
  },
}))
