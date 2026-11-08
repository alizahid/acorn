import { type Nullable } from '~/types'

// 'https://amp.reddit.com/user/mildpanda/m/js', // user:mildpanda, feed:js
// 'https://www.reddit.com/user/mildpanda/comments/1i7h986/three_images/', // user:mildpanda, postId:1i7h986
// 'https://www.reddit.com/user/mildpanda/comments/1i7h986/comment/mcv3hr9/', // user:mildpanda, postId:1i7h986, commentId:mcv3hr9
// 'https://www.reddit.com/user/mildpanda/comments/1i7h986/comment/mcv3hr9/?context=3', // user:mildpanda, postId:1i7h986, commentId:mcv3hr9, context:3
// 'https://i.reddit.com/r/acornblue/', // community:acornblue
// 'https://www.reddit.com/r/macgaming/comments/1jeumij/well_i_did_it_preorder_ac_shadows/', // community:macgaming, postId:1jeumij
// 'https://www.reddit.com/r/live/comments/1dtm4eq/comment/lvn4wgx/', // community:live, postId:1dtm4eq, commentId:lvn4wgx
// 'https://www.reddit.com/r/macgaming/wiki/faq/', // community:macgaming, wiki:faq
// 'https://www.reddit.com/r/wow/s/gT8f86WL7A', // community:wow, shareId:gT8f86WL7A
// 'https://www.reddit.com/live/18hnzysb1elcs', // liveId:18hnzysb1elcs
// 'https://www.reddit.com/r/acornblue/comments/1gdy1c4/join_us_on_discord/mh8vxwr/', // community:acornblue, postId:1gdy1c4, commentId:mh8vxwr, context:3
// 'https://reddit.com/comments/1w613gr' // postId:1w613gr

export const linkRegex =
  /^(?:https?:\/\/)?(?:[\w-]+\.)?reddit\.com\/(?:user\/(?<user>[^/]+)(?:\/m\/(?<feed>[^/]+)|\/comments\/(?<userPostId>[^/]+)(?:\/comment\/(?<userCommentId>[^/]+))?(?:\/\?context=(?<userContext>\d+))?)?|r\/(?<community>[^/]+)(?:\/comments\/(?<communityPostId>[^/]+)(?:\/[^/]+(?:\/(?<communityCommentId>[^/]+))?(?:\/\?context=(?<communityContext>\d+))?)?|\/s\/(?<shareId>[^/]+)(?:\?context=(?<shareContext>\d+))?|\/wiki\/(?<wiki>[^/]+))?|comments\/(?<shortPostId>[^/]+)|live\/(?<liveId>[^/]+)(?:\?context=(?<liveContext>\d+))?)/iu

export function parseLink(url: string): Nullable<{
  commentId?: string
  community?: string
  context?: string
  feed?: string
  liveId?: string
  postId?: string
  shareId?: string
  user?: string
  wiki?: string
}> {
  const match = linkRegex.exec(url)

  if (!match) {
    return null
  }

  const {
    user,
    feed,
    userPostId,
    userCommentId,
    userContext,
    community,
    communityPostId,
    communityCommentId,
    communityContext,
    shareId,
    shareContext,
    wiki,
    liveId,
    shortPostId,
    liveContext,
  } = match.groups ?? {}

  return {
    commentId: userCommentId ?? communityCommentId,
    community,
    context: userContext ?? communityContext ?? shareContext ?? liveContext,
    feed,
    liveId,
    postId: userPostId ?? communityPostId ?? shortPostId,
    shareId,
    user,
    wiki,
  }
}
