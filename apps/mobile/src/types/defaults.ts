export type SearchTab = 'post' | 'community' | 'user'

export type SearchTabs = Array<{
  disabled: boolean
  key: SearchTab
}>

export type DrawerSection = 'feed' | 'feeds' | 'communities' | 'users'

export type DrawerSections = Array<{
  disabled: boolean
  key: DrawerSection
}>
