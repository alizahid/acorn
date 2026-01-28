import { ScrollView } from 'react-native-gesture-handler'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { Menu } from '~/components/common/menu'
import { Slider } from '~/components/common/slider'
import { View } from '~/components/common/view'
import { Themes } from '~/components/settings/themes'
import { useList } from '~/hooks/list'
import { type Font, fonts } from '~/lib/fonts'
import { type PreferencesPayload, usePreferences } from '~/stores/preferences'
import { type TypographyToken, typography } from '~/styles/tokens'

export default function Screen() {
  const t = useTranslations('screen.settings.appearance')

  const {
    blurNavigation,
    colorfulComments,
    feedCompact,
    font,
    fontScaling,
    fontSizeBody,
    fontSizeTitle,
    largeThumbnails,
    mediaOnRight,
    systemScaling,
    theme,
    themeOled,
    themeTint,
    update,
  } = usePreferences()

  const listProps = useList()

  const sizes = {
    fontSizeBody,
    fontSizeTitle,
  }

  return (
    <ScrollView {...listProps}>
      <Menu.Root>
        <Menu.Label>{t('preferences.title')}</Menu.Label>

        <Menu.Switch
          icon={<Icon name="tv" />}
          label={t('preferences.themeOled')}
          onChange={(next) => {
            const payload: Partial<PreferencesPayload> = {
              themeOled: next,
            }

            if (next) {
              payload.themeTint = false
            }

            update(payload)
          }}
          value={themeOled}
        />

        <Menu.Switch
          icon={<Icon name="paintbrush.pointed" />}
          label={t('preferences.themeTint')}
          onChange={(next) => {
            const payload: Partial<PreferencesPayload> = {
              themeTint: next,
            }

            if (next) {
              payload.themeOled = false
            }

            update(payload)
          }}
          value={themeTint}
        />

        <Menu.Switch
          icon={<Icon name="drop" />}
          label={t('preferences.blurNavigation')}
          onChange={(next) => {
            update({
              blurNavigation: next,
            })
          }}
          value={blurNavigation}
        />

        <Menu.Switch
          icon={<Icon name="paintpalette" />}
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
          icon={<Icon name="rectangle.split.1x2" />}
          label={t('compact.feedCompact')}
          onChange={(next) => {
            update({
              feedCompact: next,
            })
          }}
          value={feedCompact}
        />

        <Menu.Switch
          icon={<Icon name="mosaic" />}
          label={t('compact.largeThumbnails')}
          onChange={(next) => {
            update({
              largeThumbnails: next,
            })
          }}
          value={largeThumbnails}
        />

        <Menu.Switch
          icon={<Icon name="photo.on.rectangle.angled" />}
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
          options={(['basis', 'apercu', 'fold', 'system'] as const).map(
            (item) => ({
              label: t(`fonts.${item}`),
              labelStyle: {
                fontFamily: fonts[item],
              },
              value: item,
            }),
          )}
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
          <View height="8" justify="center" mx="3">
            <Slider
              disabled={systemScaling}
              max={1.2}
              min={0.8}
              onChange={(next) => {
                update({
                  fontScaling: next,
                })
              }}
              step={0.1}
              value={fontScaling}
            />
          </View>
        )}

        {(['fontSizeTitle', 'fontSizeBody'] as const).map((item) => (
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
              right: <Icon name={`${token as TypographyToken}.circle.fill`} />,
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
