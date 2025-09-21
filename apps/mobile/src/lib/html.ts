import { decode } from 'entities'
import { escapeRegExp } from 'lodash'

import { type PostMediaMeta } from '~/types/post'

export function decodeHtml(html?: string | null) {
  if (!html) {
    return
  }

  return decode(html)
    .replaceAll(
      /```(\w+)(\s*)([\s\S]*?)```/gm,
      (_match, lang, _space, code) =>
        `<pre><code data-lang="${lang || 'text'}">${code.replaceAll(/<\/?(code|p|pre)>/g, '')}</code></pre>`,
    )
    .replaceAll('&amp;', '&')
    .replaceAll(/>\s*</g, '><')
    .replaceAll('amp.reddit.com', 'www.reddit.com')
    .replaceAll('<!-- SC_ON -->', '')
    .replaceAll('<!-- SC_OFF -->', '')
    .replaceAll('href="/r/', 'href="https://www.reddit.com/r/')
    .replaceAll('href="r/', 'href="https://www.reddit.com/r/')
    .replaceAll('href="/u/', 'href="https://www.reddit.com/user/')
    .replaceAll('href="u/', 'href="https://www.reddit.com/user/')
    .replaceAll(
      /<span class="md-spoiler-text">(.*?)<\/span>/g,
      '<spoiler>$1</spoiler>',
    )
    .replaceAll('<blockquote><p>', '<blockquote>')
    .replaceAll('</p></blockquote>', '</blockquote>')
    .replaceAll('<p><pre>', '<pre>')
    .replaceAll('</pre></p>', '</pre>')
    .replaceAll('\n</code>', '</code>')
    .slice(16, -6)
    .trim()
}

export function mergeHtmlMeta(html: string, meta?: PostMediaMeta) {
  if (!meta) {
    return html
  }

  let merged = html

  for (const media of Object.values(meta)) {
    if (media.type !== 'video') {
      const regex = new RegExp(`<a href="${escapeRegExp(media.url)}">(.*?)</a>`)

      merged = merged.replace(regex, (_value, caption: string) => {
        if (caption === media.url) {
          return `<figure><img height="${media.height}" width="${media.width}" src="${media.url}" /></figure>`
        }

        return `<figure><img height="${media.height}" width="${media.width}" src="${media.url}" /><figcaption>${caption}</figcaption></figure>`
      })
    }
  }

  return merged
}
