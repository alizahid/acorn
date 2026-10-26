import { type PostMediaMeta } from '@acorn/reddit'
import { decode } from 'entities'

const redditLinkRegex = /(?<!\S)\/?[ru]\/[A-Za-z0-9_-]+/gu
const urlRegex = /https?:\/\/\S+/gu
const videoRegex = /\/link\/[^/]+\/video\/(?<id>[^/]+)/u
const mediaRegex =
  /!\[(?<alt>[^\]]*)\]\((?<target>[^\s)]+)(?:\s+"(?<caption>(?:[^"\\]|\\.)*)")?\)/gu
const imageSlotRegex = /\uE000(?<index>\d+)\uE000/gu
const enrichedSpoilerRegex = /\|\|(?<content>.*?)\|\|/gu
const giphyRegex =
  /!\[(?<alt>(?:[^\]\\]|\\.)*)\]\(giphy\|(?<id>[a-zA-Z0-9]+)(?:\|(?<type>[a-zA-Z0-9]+))?\)/gu
const escapedPunctuationRegex = /\\(?=[!-/:-@[-`{-~])/gu
const escapedQuoteRegex = /\\"/gu
const altSpecialCharsRegex = /[[\]\\]/gu
const regexSpecialCharsRegex = /[.*+?^${}()|[\]\\]/gu

const placeholderAlts = ['gif', 'img', 'video']

export function transformMarkdown(markdown: string | null) {
  if (!markdown) {
    return ''
  }

  const images: Array<string> = []

  return decode(markdown)
    .replace(mediaRegex, (_, alt: string, target: string, caption?: string) => {
      const text =
        caption === undefined
          ? placeholderAlts.includes(alt)
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

      return url.replace(escapedPunctuationRegex, '')
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
    .replace(enrichedSpoilerRegex, '>!$<content>!<')
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
      merged = merged.replaceAll(
        media.url,
        `![](${media.thumbnail ?? media.url})`,
      )
    }
  }

  for (const [id, media] of Object.entries(meta)) {
    if (media.type === 'video') {
      merged = merged.replace(
        new RegExp(
          `!\\[(?:[^\\]\\\\]|\\\\.)*\\]\\(${escapeRegex(id)}(?:\\s+"[^"]*")?\\)`,
          'gu',
        ),
        `<video src="${media.url}" />`,
      )

      continue
    }

    merged = merged.replace(
      new RegExp(
        `(?<alt>!\\[(?:[^\\]\\\\]|\\\\.)*\\])\\(${escapeRegex(id)}(?<caption>\\s+"[^"]*")?\\)`,
        'gu',
      ),
      `$<alt>(${media.thumbnail ?? media.url}$<caption>)`,
    )
  }

  return merged
}

function escapeAlt(caption: string) {
  return caption
    .replace(escapedQuoteRegex, '"')
    .replace(altSpecialCharsRegex, '\\$&')
}

function escapeRegex(value: string) {
  return value.replace(regexSpecialCharsRegex, '\\$&')
}
