import { useTranslations } from 'use-intl'

import { IntervalIcons } from '~/lib/sort'
import { TopInterval } from '~/types/sort'

import { Icon } from '../common/icon'
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
      icon={<Icon name="clock" />}
      label={label}
      onChange={onChange}
      options={TopInterval.map((item) => ({
        label: t(`interval.${item}`),
        right: (
          <Icon
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
