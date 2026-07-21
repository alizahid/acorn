export type SearchTab = 'post' | 'community' | 'user'

export type SearchTabs = Array<{
  disabled: boolean
  key: SearchTab
}>

type DrawerSection = 'feed' | 'feeds' | 'communities'

export type DrawerSections = Array<{
  disabled: boolean
  key: DrawerSection
}>
