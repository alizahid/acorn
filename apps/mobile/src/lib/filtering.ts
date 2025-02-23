export function filter(keywords: Array<string>, text: string) {
  if (keywords.length === 0) {
    return true
  }

  return !new RegExp(`(${keywords.join('|')})`, 'i').test(text)
}
