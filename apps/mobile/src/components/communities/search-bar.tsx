import { useRouter } from 'expo-router'
import { type StyleProp, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon } from '../common/icon'
import { TextBox } from '../common/text-box'

type Props = {
  name: string
  style?: StyleProp<ViewStyle>
}

export function CommunitySearchBar({ name, style }: Props) {
  const router = useRouter()

  const t = useTranslations('component.communities.searchBar')

  const { styles, theme } = useStyles(stylesheet)

  return (
    <TextBox
      autoCapitalize="none"
      autoComplete="off"
      autoCorrect={false}
      left={
        <Icon
          color={theme.colors.gray.accent}
          name="MagnifyingGlass"
          style={styles.icon}
        />
      }
      onSubmitEditing={(event) => {
        const query = event.nativeEvent.text

        if (query.length > 2) {
          router.push({
            params: {
              name,
              query,
            },
            pathname: '/communities/[name]/search',
          })
        }
      }}
      placeholder={t('placeholder')}
      returnKeyType="search"
      style={[styles.main, style]}
      styleContent={styles.content}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  content: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  icon: {
    marginLeft: theme.space[3],
  },
  main: {
    flexGrow: 1,
    height: theme.space[8],
  },
}))
