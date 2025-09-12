import { NodeHtmlMarkdown } from 'node-html-markdown'

const nhm = new NodeHtmlMarkdown()

export function htmlToMarkdown(html: string) {
  return nhm.translate(html)
}
