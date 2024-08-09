import { BlurView } from 'expo-blur'
import { useGlobalSearchParams, useRouter } from 'expo-router'
import { FlatList, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { SearchType } from '~/types/search'

import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { TextBox } from '../common/text-box'
import { HeaderButton } from '../navigation/header-button'

const schema = z.object({
  query: z.string().catch(''),
  type: z.enum(SearchType).catch('post'),
})

export function SearchHeader() {
  const insets = useSafeAreaInsets()

  const router = useRouter()

  const params = schema.parse(useGlobalSearchParams())

  const t = useTranslations('component.search.bar')

  const { styles } = useStyles(stylesheet)

  return (
    <BlurView intensity={100} style={styles.main(insets.top)}>
      <View style={styles.header}>
        <View>
          <TextBox
            onChangeText={(query) => {
              router.setParams({
                query,
              })
            }}
            placeholder={t('query.placeholder')}
            styleInput={styles.input}
            value={params.query}
          />

          {params.query.length > 0 ? (
            <HeaderButton
              color="gray"
              icon="XCircle"
              onPress={() => {
                router.setParams({
                  query: '',
                })
              }}
              style={styles.clear}
              weight="fill"
            />
          ) : null}
        </View>

        <FlatList
          contentContainerStyle={styles.list}
          data={SearchType}
          horizontal
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                router.setParams({
                  type: item,
                })
              }}
              style={[styles.item, item === params.type && styles.selected]}
            >
              <Text contrast size="2" weight="medium">
                {t(`type.${item}`)}
              </Text>
            </Pressable>
          )}
        />
      </View>
    </BlurView>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  clear: {
    height: theme.space[7],
    position: 'absolute',
    right: 0,
    top: 0,
    width: theme.space[7],
  },
  header: {
    gap: theme.space[4],
    padding: theme.space[4],
  },
  input: {
    backgroundColor: theme.colors.gray.a3,
    borderRadius: theme.radius[4],
    borderWidth: 0,
  },
  item: {
    backgroundColor: theme.colors.gray.a3,
    borderRadius: theme.radius[6],
    height: theme.space[6],
    justifyContent: 'center',
    paddingHorizontal: theme.space[3],
  },
  list: {
    gap: theme.space[2],
  },
  main: (inset: number) => ({
    left: 0,
    paddingTop: inset,
    position: 'absolute',
    right: 0,
    top: 0,
  }),
  selected: {
    backgroundColor: theme.colors.accent.a9,
  },
}))
