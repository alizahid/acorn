function check() {
  const parts = parseLink(window.location.href)

  if (parts) {
    const { commentId, community, feed, postId, shareId, user } = parts

    if (shareId) {
      window.location.replace(window.location.href)

      return
    }

    if (postId && commentId) {
      window.location.replace(`acorn:///posts/${postId}?commentId=${commentId}`)

      return
    }

    if (postId) {
      window.location.replace(`acorn:///posts/${postId}`)

      return
    }

    if (feed) {
      window.location.replace(`acorn:///?feed=${feed}`)

      return
    }

    if (user) {
      window.location.replace(`acorn:///users/${user}`)

      return
    }

    if (community) {
      window.location.replace(`acorn:///communities/${community}`)
    }
  }
}

const linkRegex =
  /^(?:https?:\/\/)?(?:www\.|amp\.|i\.|old\.)?reddit\.com\/(?:user\/(?<user>[^/]+)(?:\/m\/(?<feed>[^/]+)|\/comments\/(?<userPostId>[^/]+)(?:\/comment\/(?<userCommentId>[^/]+))?(?:\/\?context=(?<userContext>\d+))?)?|r\/(?<community>[^/]+)(?:\/comments\/(?<communityPostId>[^/]+)(?:\/[^/]+(?:\/(?<communityCommentId>[^/]+))?(?:\/\?context=(?<communityContext>\d+))?)?|\/s\/(?<shareId>[^/]+)(?:\?context=(?<shareContext>\d+))?|\/wiki\/(?<wiki>[^/]+))?|live\/(?<liveId>[^/]+)(?:\?context=(?<liveContext>\d+))?)/iu

function parseLink(url) {
  const match = url.match(linkRegex)

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
    liveContext,
  } = match.groups

  return {
    commentId: userCommentId || communityCommentId,
    community,
    context: userContext || communityContext || shareContext || liveContext,
    feed,
    liveId,
    postId: userPostId || communityPostId,
    shareId,
    user,
    wiki,
  }
}

check()
