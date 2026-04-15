import { decode } from 'entities'

import { type PostMediaMeta } from '~/types/post'

const redditSpoilerRegex = />!(.*?)!</g
const redditLinkRegex = /(?<!\S)\/?[ru]\/[A-Za-z0-9_-]+/g

const enrichedSpoilerRegex = /\|\|(.*?)\|\|/g
const giphyRegex = /!\[gif\]\(giphy\|([a-zA-Z0-9]+)(?:\|([a-zA-Z0-9]+))?\)/g

export function markdownToEnriched(markdown: string | null) {
  if (!markdown) {
    return ''
  }

  return decode(markdown)
    .replace(redditSpoilerRegex, '||$1||')
    .replace(
      redditLinkRegex,
      (name) =>
        `[${name}](https://www.reddit.com/${name.startsWith('/') ? name.slice(1) : name})`,
    )
    .trim()
}

export function enrichedToMarkdown(markdown: string) {
  return markdown
    .replace(enrichedSpoilerRegex, '>!$1!<')
    .replace(
      redditLinkRegex,
      (name) =>
        `[${name}](https://www.reddit.com/${name.startsWith('/') ? name.slice(1) : name})`,
    )
}

export function mergeMetaMarkdown(markdown: string, meta?: PostMediaMeta) {
  if (!meta) {
    return markdown
  }

  let merged = markdown

  if (merged.includes('giphy')) {
    merged = merged.replace(giphyRegex, (_, id, type) => {
      if (type) {
        return `https://media.giphy.com/media/${id}/giphy-${type}.gif`
      }

      return `https://media.giphy.com/media/${id}/giphy.gif`
    })
  }

  for (const media of Object.values(meta)) {
    if (merged.includes(media.url) && !merged.includes(`[${media.url}]`)) {
      merged = merged.replaceAll(media.url, `![](${media.url})`)
    }
  }

  return merged
}
