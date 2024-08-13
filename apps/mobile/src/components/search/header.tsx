import { BlurView } from 'expo-blur'
import { useGlobalSearchParams, useRouter } from 'expo-router'
import { View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { useCommon } from '~/hooks/common'
import { SearchType } from '~/types/search'

import { Icon } from '../common/icon'
import { SegmentedControl } from '../common/segmented-control'
import { TextBox } from '../common/text-box'
import { HeaderButton } from '../navigation/header-button'

const schema = z.object({
  query: z.string().catch(''),
  type: z.enum(SearchType).catch('post'),
})

export function SearchHeader() {
  const common = useCommon()

  const router = useRouter()

  const params = schema.parse(useGlobalSearchParams())

  const t = useTranslations('component.search.header')

  const { styles, theme } = useStyles(stylesheet)

  return (
    <BlurView intensity={75} style={styles.main(common.insets.top)}>
      <View style={styles.header}>
        <View>
          <Icon
            color={theme.colors.gray.a9}
            name="MagnifyingGlass"
            style={styles.search}
          />

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

        <SegmentedControl
          active={SearchType.indexOf(params.type)}
          items={SearchType.map((item) => t(`type.${item}`))}
          onChange={(index) => {
            router.setParams({
              type: SearchType[index],
            })
          }}
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
    paddingLeft: theme.space[2] + theme.space[5] + theme.space[2],
  },
  main: (inset: number) => ({
    left: 0,
    paddingTop: inset,
    position: 'absolute',
    right: 0,
    top: 0,
  }),
  search: {
    left: theme.space[2],
    position: 'absolute',
    top: theme.space[2],
  },
}))
