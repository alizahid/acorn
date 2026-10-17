import { View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useMMKVNumber } from 'react-native-mmkv'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'
import { useFormatter, useTranslations } from 'use-intl'

import { acornBuild } from '~/lib/common'

import { Icon } from '../common/icon'
import { IconButton } from '../common/icon/button'
import { Text } from '../common/text'
import { changelog } from './changelog'
import { ChangelogItems } from './items'

export function Changelog() {
  const t = useTranslations('component.changelog')
  const f = useFormatter()

  const [lastSeen, setLastSeen] = useMMKVNumber('changelog-seen')

  if (lastSeen && lastSeen >= acornBuild) {
    return null
  }

  const items = changelog.filter(
    (item) =>
      item.build > (lastSeen ?? acornBuild - 1) && item.build <= acornBuild,
  )

  if (items.length === 0) {
    return null
  }

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.main}>
      <View style={styles.wrapper}>
        <Text size="4" style={styles.title} weight="bold">
          {t('title')}
        </Text>

        <IconButton
          accessibilityLabel={t('close')}
          onPress={() => {
            setLastSeen(acornBuild)
          }}
          style={styles.close}
        >
          <Icon
            name="x-bold"
            uniProps={(theme) => ({
              color: theme.colors.gray.text,
            })}
          />
        </IconButton>

        <ScrollView contentContainerStyle={styles.content}>
          {items.map((item) => (
            <View key={item.build} style={styles.item}>
              <Text size="6" tabular weight="bold">
                {t(item.version ? 'version' : 'build', {
                  build: item.build,
                  version: item.version!,
                })}
              </Text>

              {item.added ? (
                <ChangelogItems items={item.added} type="added" />
              ) : null}

              {item.fixed ? (
                <ChangelogItems items={item.fixed} type="fixed" />
              ) : null}

              {item.changed ? (
                <ChangelogItems items={item.changed} type="changed" />
              ) : null}

              {item.removed ? (
                <ChangelogItems items={item.removed} type="removed" />
              ) : null}

              {item.thanks ? (
                <Text color="amber" size="2" weight="medium">
                  {t('thanks', {
                    people: f.list(item.thanks),
                  })}
                </Text>
              ) : null}
            </View>
          ))}
        </ScrollView>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create((theme, runtime) => ({
  close: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  content: {
    gap: theme.space[5],
    padding: theme.space[5],
  },
  item: {
    gap: theme.space[4],
  },
  main: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.ui.overlay,
    paddingBottom: theme.space[4] + runtime.insets.bottom,
    paddingLeft: theme.space[4] + runtime.insets.left,
    paddingRight: theme.space[4] + runtime.insets.right,
    paddingTop: theme.space[4] + runtime.insets.top,
    position: 'absolute',
  },
  title: {
    marginBottom: theme.space[4],
    marginHorizontal: theme.space[5],
    marginTop: theme.space[5],
  },
  wrapper: {
    backgroundColor: theme.colors.ui.bg,
    borderCurve: 'continuous',
    borderRadius: theme.radius[6],
    flexShrink: 1,
    maxHeight:
      runtime.screen.height -
      theme.space[4] +
      runtime.insets.top -
      theme.space[4] +
      runtime.insets.bottom,
  },
}))
