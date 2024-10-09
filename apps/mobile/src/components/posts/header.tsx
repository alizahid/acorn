import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { cardMaxWidth, iPad } from '~/lib/const'
import { usePreferences } from '~/stores/preferences'

import { CommentsSortMenu } from '../comments/sort'
import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { View } from '../common/view'

type Props = {
  commentId?: string
  onPress?: () => void
  sticky?: boolean
}

export function PostHeader({ commentId, onPress, sticky }: Props) {
  const t = useTranslations('component.posts.header')

  const { sortPostComments, update } = usePreferences()

  const { styles, theme } = useStyles(stylesheet)

  return (
    <View align="center" direction="row" style={styles.main(Boolean(sticky))}>
      {commentId ? (
        <Pressable
          align="center"
          direction="row"
          gap="2"
          height="8"
          onPress={onPress}
          px="3"
        >
          <Icon color={theme.colors.accent.a9} name="ArrowArcLeft" />

          <Text weight="medium">{t('back')}</Text>
        </Pressable>
      ) : null}

      <CommentsSortMenu
        onChange={(next) => {
          update({
            sortPostComments: next,
          })
        }}
        style={styles.sort}
        value={sortPostComments}
      />
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: (sticky: boolean) => {
    const base = {
      backgroundColor: theme.colors.gray[sticky ? 1 : 'a3'],
    }

    if (iPad) {
      return {
        ...base,
        alignSelf: 'center',
        borderCurve: sticky ? undefined : 'continuous',
        borderRadius: sticky ? undefined : theme.radius[3],
        maxWidth: cardMaxWidth,
        width: '100%',
      }
    }

    return base
  },
  sort: {
    marginLeft: 'auto',
  },
}))
