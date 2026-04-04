import { useEffect, useRef, useState } from 'react'
import { Linking, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { useClientId } from '~/hooks/purchases/client-id'
import { REDIRECT_URI } from '~/reddit/config'

import { Button } from '../common/button'
import { Copy } from '../common/copy'
import { Icon } from '../common/icon'
import { IconButton } from '../common/icon/button'
import { Sheet } from '../common/sheet'
import { Spinner } from '../common/spinner'
import { Text } from '../common/text'
import { TextBox } from '../common/text-box'

export function ClientId() {
  const t = useTranslations('component.auth.clientId')

  const { clientId: data, isPending, updateClientId } = useClientId()

  const sheet = useRef<Sheet>(null)

  const [clientId, setClientId] = useState('')

  useEffect(() => {
    if (!clientId && typeof data === 'string') {
      setClientId(data)
    }
  }, [clientId, data])

  return (
    <>
      {data === undefined ? (
        <Spinner />
      ) : data ? (
        <View style={styles.main}>
          <View style={styles.content}>
            <Icon
              name="checkmark.circle.fill"
              uniProps={(theme) => ({
                tintColor: theme.colors.green.accent,
              })}
            />

            <Text color="green" highContrast={false}>
              {t('yes.title')}
            </Text>
          </View>

          <Button
            color="blue"
            label={t('yes.edit')}
            onPress={() => {
              sheet.current?.present()
            }}
            style={styles.button}
          />
        </View>
      ) : (
        <View style={styles.main}>
          <View style={styles.content}>
            <Icon
              name="xmark.circle.fill"
              uniProps={(theme) => ({
                tintColor: theme.colors.red.accent,
              })}
            />

            <Text color="red" highContrast={false}>
              {t('no.title')}
            </Text>
          </View>

          <Button
            color="green"
            label={t('no.add')}
            onPress={() => {
              sheet.current?.present()
            }}
            style={styles.button}
          />
        </View>
      )}

      <Sheet.Root ref={sheet}>
        <Sheet.Header title={t('sheet.title')} />

        <View style={styles.sheetContent}>
          <Text>
            {t.rich('sheet.instructions.1', {
              highlight: (text) => (
                <Text color="blue" weight="medium">
                  {text}
                </Text>
              ),
              link: (text) => (
                <Text
                  color="accent"
                  onPress={() => {
                    Linking.openURL('https://www.reddit.com/prefs/apps')
                  }}
                  weight="bold"
                >
                  {text}
                </Text>
              ),
            })}
          </Text>

          <Copy style={styles.uri} value={REDIRECT_URI} />

          <View style={styles.instructions}>
            <Text>{t('sheet.instructions.2')}</Text>

            <TextBox
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect={false}
              onChangeText={setClientId}
              placeholder={t('sheet.clientId.placeholder')}
              right={
                data ? (
                  <IconButton
                    color="red"
                    icon="trash"
                    label={t('sheet.remove')}
                    loading={isPending}
                    onPress={async () => {
                      await updateClientId({
                        clientId: null,
                      })

                      setClientId('')
                    }}
                  />
                ) : null
              }
              style={styles.clientId}
              value={clientId}
              variant="mono"
            />
          </View>

          <Button
            disabled={clientId.length === 0}
            label={t('sheet.save')}
            loading={isPending}
            onPress={async () => {
              await updateClientId({
                clientId,
              })

              sheet.current?.dismiss()
            }}
          />
        </View>

        <Sheet.BottomInset />
      </Sheet.Root>
    </>
  )
}

const styles = StyleSheet.create((theme) => ({
  button: {
    height: theme.space[6],
    paddingHorizontal: theme.space[3],
  },
  clientId: {
    backgroundColor: theme.colors.gray.uiAlpha,
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[2],
  },
  instructions: {
    gap: theme.space[2],
  },
  main: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[4],
  },
  sheetContent: {
    gap: theme.space[4],
    padding: theme.space[4],
  },
  uri: {
    backgroundColor: theme.colors.accent.uiAlpha,
  },
}))
