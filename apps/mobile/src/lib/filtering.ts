export function filterByKeyword(
  rules: Array<string>,
  {
    community,
    title,
    user,
  }: {
    community?: string
    title?: string
    user?: string
  },
) {
  if (rules.length === 0) {
    return true
  }

  const communities = rules
    .filter((keyword) => keyword.startsWith('community:'))
    .map((keyword) => keyword.slice(10))

  const users = rules
    .filter((keyword) => keyword.startsWith('user:'))
    .map((keyword) => keyword.slice(5))

  const keywords = rules.filter(
    (keyword) => ![...communities, ...users].includes(keyword),
  )

  if (community) {
    return !new RegExp(`(${communities.join('|')})`, 'i').test(community)
  }

  if (user) {
    return !new RegExp(`(${users.join('|')})`, 'i').test(user)
  }

  if (title) {
    return !new RegExp(`(${keywords.join('|')})`, 'i').test(title)
  }

  return true
}
