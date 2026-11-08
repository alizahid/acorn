/// <reference types="bun" />

import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'

import { linkRegex, parseLink } from './link'

describe('parseLink', () => {
  test.each([
    [
      'https://amp.reddit.com/user/mildpanda/m/js',
      { feed: 'js', user: 'mildpanda' },
    ],
    [
      'https://www.reddit.com/user/mildpanda/comments/1i7h986/three_images/',
      { postId: '1i7h986', user: 'mildpanda' },
    ],
    [
      'https://www.reddit.com/user/mildpanda/comments/1i7h986/comment/mcv3hr9/',
      { commentId: 'mcv3hr9', postId: '1i7h986', user: 'mildpanda' },
    ],
    [
      'https://www.reddit.com/user/mildpanda/comments/1i7h986/comment/mcv3hr9/?context=3',
      {
        commentId: 'mcv3hr9',
        context: '3',
        postId: '1i7h986',
        user: 'mildpanda',
      },
    ],
    ['https://i.reddit.com/r/acornblue/', { community: 'acornblue' }],
    [
      'https://www.reddit.com/r/macgaming/comments/1jeumij/well_i_did_it_preorder_ac_shadows/',
      { community: 'macgaming', postId: '1jeumij' },
    ],
    [
      'https://www.reddit.com/r/live/comments/1dtm4eq/comment/lvn4wgx/',
      { commentId: 'lvn4wgx', community: 'live', postId: '1dtm4eq' },
    ],
    [
      'https://www.reddit.com/r/acornblue/comments/1gdy1c4/join_us_on_discord/mh8vxwr/',
      { commentId: 'mh8vxwr', community: 'acornblue', postId: '1gdy1c4' },
    ],
    [
      'https://www.reddit.com/r/macgaming/wiki/faq/',
      { community: 'macgaming', wiki: 'faq' },
    ],
    [
      'https://www.reddit.com/r/wow/s/gT8f86WL7A',
      { community: 'wow', shareId: 'gT8f86WL7A' },
    ],
    ['https://www.reddit.com/live/18hnzysb1elcs', { liveId: '18hnzysb1elcs' }],
    ['https://reddit.com/comments/1w613gr', { postId: '1w613gr' }],
    ['https://www.reddit.com/comments/1w613gr/', { postId: '1w613gr' }],
  ])('%s', (url, expected) => {
    expect(parseLink(url)).toEqual(expected)
  })

  test.each([
    ['no subdomain', 'https://reddit.com/r/acornblue/'],
    ['old', 'https://old.reddit.com/r/acornblue/'],
    ['mobile', 'https://m.reddit.com/r/acornblue/'],
    ['np', 'https://np.reddit.com/r/acornblue/'],
    ['no protocol', 'reddit.com/r/acornblue'],
    ['http', 'http://www.reddit.com/r/acornblue'],
  ])('matches %s', (_, url) => {
    expect(parseLink(url)).toEqual({ community: 'acornblue' })
  })

  test.each([
    'https://example.com/r/acornblue/',
    'https://evilreddit.com/r/acornblue/',
    'https://reddit.com.evil.com/r/acornblue/',
    'https://example.com/?url=https://reddit.com/r/acornblue/',
    'https://www.reddit.com/',
  ])('rejects %s', (url) => {
    expect(parseLink(url)).toBeNull()
  })
})

test('Safari extension uses the same regex', () => {
  const source = readFileSync(
    new URL('../../targets/safari/assets/content.js', import.meta.url),
    'utf8',
  )

  expect(source).toContain(String(linkRegex))
})
