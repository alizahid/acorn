import { BlurView } from 'expo-blur'
import { type SharedValue } from 'react-native-reanimated'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { useCommon } from '~/hooks/common'
import { SearchTab } from '~/types/search'

import { Icon } from '../common/icon'
import { SegmentedControl } from '../common/segmented-control'
import { TextBox } from '../common/text-box'
import { View } from '../common/view'
import { HeaderButton } from '../navigation/header-button'

type Props = {
  offset: SharedValue<number>
  onChange: (index: number) => void
  onQueryChange: (query: string) => void
  query: string
}

export function SearchHeader({
  offset,
  onChange,
  onQueryChange,
  query,
}: Props) {
  const common = useCommon()

  const t = useTranslations('component.search.header')

  const { styles, theme } = useStyles(stylesheet)

  return (
    <BlurView intensity={100} style={styles.main(common.insets.top)}>
      <View m="4" mb="0">
        <Icon
          color={theme.colors.gray.a9}
          name="MagnifyingGlass"
          style={styles.search}
        />

        <TextBox
          onChangeText={onQueryChange}
          placeholder={t('query.placeholder')}
          styleInput={styles.input}
          value={query}
        />

        {query.length > 0 ? (
          <HeaderButton
            color="gray"
            icon="XCircle"
            onPress={() => {
              onQueryChange('')
            }}
            style={styles.clear}
            weight="fill"
          />
        ) : null}
      </View>

      <SegmentedControl
        items={SearchTab.map((item) => t(`tab.${item}`))}
        offset={offset}
        onChange={(index) => {
          onChange(index)
        }}
      />
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
  input: {
    backgroundColor: theme.colors.gray.a3,
    borderCurve: 'continuous',
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
