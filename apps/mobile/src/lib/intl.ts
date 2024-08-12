export function withoutAgo(time: string) {
  if (time.endsWith(' ago')) {
    return time.slice(0, -4)
  }

  return time
}
