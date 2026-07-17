const prefixes = {
  account: 't2_',
  award: 't6_',
  comment: 't1_',
  link: 't3_',
  message: 't4_',
  subreddit: 't5_',
} as const

export function addPrefix(id: string, type: keyof typeof prefixes) {
  const prefix = prefixes[type]

  if (id.startsWith(prefix)) {
    return id
  }

  return prefix + id
}

export function removePrefix(id: string) {
  if (id.startsWith('u_') || id.startsWith('u/')) {
    return id.slice(2)
  }

  for (const prefix of Object.values(prefixes)) {
    if (id.startsWith(prefix)) {
      return id.slice(3)
    }
  }

  return id
}
