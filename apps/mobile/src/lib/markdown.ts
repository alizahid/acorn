import { type PostMediaMeta } from '@acorn/reddit'
import { decode } from 'entities'

const redditLinkRegex = /(?<!\S)\/?[ru]\/[A-Za-z0-9_-]+/g
const urlRegex = /https?:\/\/\S+/g
const videoRegex = /\/link\/[^/]+\/video\/([^/]+)/

// Reddit's inline media: `![img](id "caption")`. The alt is a placeholder and
// the caption is the title, so it becomes Markdown's `![caption](id)`
const mediaRegex = /!\[([^\]]*)\]\(([^\s)]+)(?:\s+"((?:[^"\\]|\\.)*)")?\)/g
const imageSlotRegex = /\uE000(\d+)\uE000/g
const placeholderAlts = new Set(['gif', 'img', 'video'])

const enrichedSpoilerRegex = /\|\|(.*?)\|\|/g
// any alt: transformMarkdown has already swapped the `gif` placeholder for the
// caption
const giphyRegex =
  /!\[((?:[^\]\\]|\\.)*)\]\(giphy\|([a-zA-Z0-9]+)(?:\|([a-zA-Z0-9]+))?\)/g

export function transformMarkdown(markdown: string | null) {
  if (!markdown) {
    return ''
  }

  // set images aside so the link rules below leave their captions alone
  const images: Array<string> = []

  return decode(markdown)
    .replace(mediaRegex, (_, alt: string, target: string, caption?: string) => {
      const text =
        caption === undefined
          ? placeholderAlts.has(alt)
            ? ''
            : alt
          : escapeAlt(caption)

      images.push(`![${text}](${target})`)

      return `\uE000${images.length - 1}\uE000`
    })
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
    .replace(imageSlotRegex, (_, index: string) => images[Number(index)] ?? '')
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
    merged = merged.replace(giphyRegex, (_, alt, id, type) => {
      if (type) {
        return `![${alt}](https://media.giphy.com/media/${id}/giphy-${type}.gif)`
      }

      return `![${alt}](https://media.giphy.com/media/${id}/giphy.gif)`
    })
  }

  for (const media of Object.values(meta)) {
    if (merged.includes(media.url) && !merged.includes(`[${media.url}]`)) {
      merged = merged.replaceAll(media.url, `![](${media.url})`)
    }
  }

  // gql-fed bodies point at inline media by id, as in `![caption](pvo4s5n3kb3h1)`
  // (transformMarkdown has already moved the caption into the alt). After the
  // loop above, so the urls swapped in here aren't wrapped again
  for (const [id, media] of Object.entries(meta)) {
    merged = merged.replace(
      new RegExp(
        `(!\\[(?:[^\\]\\\\]|\\\\.)*\\])\\(${escapeRegex(id)}(\\s+"[^"]*")?\\)`,
        'g',
      ),
      `$1(${media.url}$2)`,
    )
  }

  return merged
}

// a caption as Markdown alt text: unescape its quotes, escape brackets
function escapeAlt(caption: string) {
  return caption.replace(/\\"/g, '"').replace(/[[\]\\]/g, '\\$&')
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
