import { useTranslations } from 'use-intl'

import { IntervalIcons } from '~/lib/sort'
import { TopInterval } from '~/types/sort'

import { Icon } from '../common/icon'
import { SFSymbol } from '../common/icon/symbol'
import { Menu } from '../common/menu'

type Props = {
  disabled?: boolean
  label: string
  onChange: (value: TopInterval) => void
  value: TopInterval
}

export function IntervalItem({ disabled, label, onChange, value }: Props) {
  const t = useTranslations('component.common')

  return (
    <Menu.Options
      disabled={disabled}
      icon={<Icon name="clock" />}
      label={label}
      onChange={onChange}
      options={TopInterval.map((item) => ({
        label: t(`interval.${item}`),
        right: (
          <SFSymbol
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
