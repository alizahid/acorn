export function getUserAgent(fixed = false) {
  if (fixed) {
    return 'ios:blue.acorn'
  }

  const major = 143 + Math.floor(Math.random() * 5)
  const patch = Math.floor(Math.random() * 6000)
  const build = Math.floor(Math.random() * 200)

  return `Mozilla/5.0 (iPhone; CPU iPhone OS 18_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/${major}.0.${patch}.${build} Mobile/15E148 Safari/604.1`
}
