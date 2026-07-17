export const InboxTab = ['notifications', 'messages'] as const

export type InboxTab = (typeof InboxTab)[number]
