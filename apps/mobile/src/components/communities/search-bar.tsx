import { useRouter } from 'expo-router'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon } from '../common/icon'
import { TextBox } from '../common/text-box'

type Props = {
  name: string
}

export function CommunitySearchBar({ name }: Props) {
  const router = useRouter()

  const t = useTranslations('component.communities.searchBar')

  const { styles, theme } = useStyles(stylesheet)

  return (
    <TextBox
      left={
        <Icon
          color={theme.colors.gray.a9}
          name="MagnifyingGlass"
          style={styles.icon}
        />
      }
      onSubmitEditing={(event) => {
        const query = event.nativeEvent.text

        if (query.length > 2) {
          router.navigate({
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
      style={styles.main}
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
