import { useTranslations } from 'use-intl'

import { SortColors, SortIcons } from '~/lib/sort'
import { type PostSort, SortOptions, type SortType } from '~/types/sort'

import { Icon } from '../common/icon'
import { Menu } from '../common/menu'

type Props<Type extends PostSort> = {
  disabled?: boolean
  label: string
  onChange: (value: Type) => void
  value: Type
  type: SortType
}

export function SortItem<Type extends PostSort>({
  disabled,
  label,
  onChange,
  type,
  value,
}: Props<Type>) {
  const t = useTranslations('component.common')

  const items = SortOptions[type]

  return (
    <Menu.Options<Type>
      disabled={disabled}
      icon={<Icon name="arrows-down-up" />}
      label={label}
      onChange={onChange}
      options={items.map((item) => ({
        label: t(`sort.${item}`),
        right: (
          <Icon
            name={SortIcons[item]}
            uniProps={(theme) => ({
              color: theme.colors[SortColors[item]].accent,
            })}
          />
        ),
        value: item as Type,
      }))}
      value={value}
    />
  )
}
