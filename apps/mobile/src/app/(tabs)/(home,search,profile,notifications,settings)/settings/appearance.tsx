import { ScrollView } from 'react-native-gesture-handler'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { useShallow } from 'zustand/react/shallow'

import { Icon } from '~/components/common/icon'
import { SFSymbol } from '~/components/common/icon/symbol'
import { Menu } from '~/components/common/menu'
import { Slider } from '~/components/common/slider'
import { Themes } from '~/components/settings/themes'
import { useListProps } from '~/hooks/list'
import { type Font, fonts } from '~/lib/fonts'
import { usePreferences } from '~/stores/preferences'
import { space, type TypographyToken, typography } from '~/styles/tokens'

export default function Screen() {
  const t = useTranslations('screen.settings.appearance')

  const {
    colorfulComments,
    feedCompact,
    font,
    fontScaling,
    fontSizeCommentBody,
    fontSizePostBody,
    fontSizeTitle,
    largeThumbnails,
    mediaOnRight,
    systemScaling,
    theme,
    update,
  } = usePreferences(
    useShallow((state) => ({
      colorfulComments: state.colorfulComments,
      feedCompact: state.feedCompact,
      font: state.font,
      fontScaling: state.fontScaling,
      fontSizeCommentBody: state.fontSizeCommentBody,
      fontSizePostBody: state.fontSizePostBody,
      fontSizeTitle: state.fontSizeTitle,
      largeThumbnails: state.largeThumbnails,
      mediaOnRight: state.mediaOnRight,
      systemScaling: state.systemScaling,
      theme: state.theme,
      update: state.update,
    })),
  )

  const sizes = {
    fontSizeCommentBody,
    fontSizePostBody,
    fontSizeTitle,
  }

  const listProps = useListProps({
    extraBottom: space[4],
    extraTop: space[4],
  })

  return (
    <ScrollView {...listProps}>
      <Menu.Root>
        <Menu.Label>{t('preferences.title')}</Menu.Label>

        <Menu.Switch
          icon={<Icon name="palette" />}
          label={t('preferences.colorfulComments')}
          onChange={(next) => {
            update({
              colorfulComments: next,
            })
          }}
          value={colorfulComments}
        />

        <Menu.Separator />

        <Menu.Label>{t('compact.title')}</Menu.Label>

        <Menu.Switch
          icon={<Icon name="rows" />}
          label={t('compact.feedCompact')}
          onChange={(next) => {
            update({
              feedCompact: next,
            })
          }}
          value={feedCompact}
        />

        <Menu.Switch
          icon={<Icon name="image-square" />}
          label={t('compact.largeThumbnails')}
          onChange={(next) => {
            update({
              largeThumbnails: next,
            })
          }}
          value={largeThumbnails}
        />

        <Menu.Switch
          icon={<Icon name="arrow-square-right" />}
          label={t('compact.mediaOnRight')}
          onChange={(next) => {
            update({
              mediaOnRight: next,
            })
          }}
          value={mediaOnRight}
        />

        <Menu.Separator />

        <Menu.Label>{t('fonts.title')}</Menu.Label>

        <Menu.Options
          hideSelected
          label={t(`fonts.${font}`)}
          onChange={(next) => {
            update({
              font: next as Font,
            })
          }}
          options={(
            ['apercu', 'basis', 'fold', 'inter', 'system'] as const
          ).map((item) => ({
            label: t(`fonts.${item}`),
            labelStyle: {
              fontFamily: fonts[item],
            },
            value: item,
          }))}
          title={t('fonts.title')}
          value={font}
        />

        <Menu.Switch
          label={t('fonts.systemScaling')}
          onChange={(next) => {
            update({
              systemScaling: next,
            })
          }}
          value={systemScaling}
        />

        {systemScaling ? null : (
          <Slider
            maximumValue={1.2}
            minimumValue={0.8}
            onValueChange={(next) => {
              update({
                fontScaling: next,
              })
            }}
            step={0.1}
            style={styles.slider}
            value={fontScaling}
          />
        )}

        {(
          ['fontSizeTitle', 'fontSizePostBody', 'fontSizeCommentBody'] as const
        ).map((item) => (
          <Menu.Options
            key={item}
            label={t(`fonts.${item}`)}
            onChange={(next) => {
              update({
                [item]: next as TypographyToken,
              })
            }}
            options={Object.keys(typography).map((token) => ({
              hideRight: true,
              label: token,
              right: (
                <SFSymbol name={`${token as TypographyToken}.circle.fill`} />
              ),
              value: token,
            }))}
            value={sizes[item]}
          />
        ))}

        <Menu.Separator />

        <Menu.Label>{t('themes.title')}</Menu.Label>

        <Themes
          onChange={(next) => {
            update({
              theme: next,
            })
          }}
          value={theme}
        />
      </Menu.Root>
    </ScrollView>
  )
}

const styles = StyleSheet.create((theme) => ({
  slider: {
    height: theme.space[8],
    justifyContent: 'center',
    marginHorizontal: theme.space[3],
  },
}))
