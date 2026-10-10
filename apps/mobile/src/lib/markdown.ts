import { type PostMediaMeta } from '@acorn/reddit'
import { decode } from 'entities'

const redditLinkRegex = /(?<!\S)\/?[ru]\/[A-Za-z0-9_-]+/g
const urlRegex = /https?:\/\/\S+/g
const videoRegex = /\/link\/[^/]+\/video\/([^/]+)/

const enrichedSpoilerRegex = /\|\|(.*?)\|\|/g
const giphyRegex = /!\[gif\]\(giphy\|([a-zA-Z0-9]+)(?:\|([a-zA-Z0-9]+))?\)/g

export function transformMarkdown(markdown: string | null) {
  if (!markdown) {
    return ''
  }

  return decode(markdown)
    .replace(urlRegex, (url) => {
      if (url.includes('reddit.com')) {
        const video = url.match(videoRegex)

        if (video) {
          const [, videoId] = video

          return `<video src="https://v.redd.it/${videoId}/HLSPlaylist.m3u8" />`
        }
      }

      return url.replace(/\\(?=[!-/:-@[-`{-~])/g, '')
    })
    .replace(
      redditLinkRegex,
      (name) =>
        `[${name}](https://www.reddit.com/${name.startsWith('/') ? name.slice(1) : name})`,
    )
    .trim()
}

export function prepareMarkdown(markdown: string) {
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
        return `![](https://media.giphy.com/media/${id}/giphy-${type}.gif)`
      }

      return `![](https://media.giphy.com/media/${id}/giphy.gif)`
    })
  }

  for (const media of Object.values(meta)) {
    if (merged.includes(media.url) && !merged.includes(`[${media.url}]`)) {
      merged = merged.replaceAll(media.url, `![](${media.url})`)
    }
  }

  // gql-fed bodies point at inline media by id, as in `![img](pvo4s5n3kb3h1)`.
  // The alt is Reddit's placeholder ("img", "gif"), so it's dropped rather than
  // shown as a caption; a real caption is the `"title"`, which is kept. After
  // the loop above, so the urls swapped in here aren't wrapped again
  for (const [id, media] of Object.entries(meta)) {
    merged = merged.replace(
      new RegExp(`!\\[[^\\]]*\\]\\(${escapeRegex(id)}(\\s+"[^"]*")?\\)`, 'g'),
      `![](${media.url}$1)`,
    )
  }

  return merged
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
