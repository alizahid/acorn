import { useTranslations } from 'use-intl'

import { IntervalIcons } from '~/lib/sort'
import { TopInterval } from '~/types/sort'

import { Icon } from '../common/icon'
import { SymbolIcon } from '../common/icon/symbol'
import { Menu } from '../common/menu'

type Props = {
  label: string
  onChange: (value: TopInterval) => void
  value: TopInterval
}

export function IntervalItem({ label, onChange, value }: Props) {
  const t = useTranslations('component.common')

  return (
    <Menu.Options
      icon={<Icon name="Clock" />}
      label={label}
      onChange={onChange}
      options={TopInterval.map((item) => ({
        label: t(`interval.${item}`),
        right: (
          <SymbolIcon
            name={IntervalIcons[item]}
            uniProps={(theme) => ({
              tintColor: theme.colors.gold.accent,
            })}
          />
        ),
        value: item,
      }))}
      value={value}
    />
  )
}
