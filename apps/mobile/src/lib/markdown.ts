import { directiveFromMarkdown } from 'mdast-util-directive'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { type PhrasingContent, type Text } from 'mdast-util-from-markdown/lib'
import { gfmFromMarkdown } from 'mdast-util-gfm'
import { gfmAutolinkLiteralFromMarkdown } from 'mdast-util-gfm-autolink-literal'
import { gfmStrikethroughFromMarkdown } from 'mdast-util-gfm-strikethrough'
import { gfmTableFromMarkdown } from 'mdast-util-gfm-table'
import { directive } from 'micromark-extension-directive'
import { gfm } from 'micromark-extension-gfm'
import { gfmAutolinkLiteral } from 'micromark-extension-gfm-autolink-literal'
import { gfmStrikethrough } from 'micromark-extension-gfm-strikethrough'
import { gfmTable } from 'micromark-extension-gfm-table'

export function parse(markdown: string) {
  const value = markdown.replaceAll(/>!(.*?)!</g, ':spoiler[$1]')

  return fromMarkdown(value, {
    extensions: [
      gfm(),
      gfmAutolinkLiteral(),
      gfmStrikethrough(),
      gfmTable(),
      directive(),
    ],
    mdastExtensions: [
      gfmFromMarkdown(),
      gfmAutolinkLiteralFromMarkdown(),
      gfmStrikethroughFromMarkdown(),
      gfmTableFromMarkdown(),
      directiveFromMarkdown(),
    ],
  })
}

// FIXME
export function getText(children: Array<PhrasingContent>) {
  const node = children.find((item) => item.type === 'text') as unknown as
    | Text
    | undefined

  if (node) {
    return node.value
  }
}