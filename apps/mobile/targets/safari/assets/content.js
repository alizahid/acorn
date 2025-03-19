function check() {
  const match = window.location.href.match(
    /reddit\.com(?:\/user\/(?<user>[^/]+)(?:\/m\/(?<feed>[^/]+)|\/comments\/(?<postId>[^/]+)(?:\/comment\/(?<commentId>[^/]+))?)?|\/r\/(?<community>[^/]+)(?:\/comments\/(?<communityPostId>[^/]+)(?:\/comment\/(?<communityCommentId>[^/]+))?|\/wiki\/(?<wiki>[^/]+)|\/s\/(?<shareId>[^/]+))?|\/live\/(?<liveId>[^/]+))/i,
  )

  if (match) {
    const { commentId, community, feed, postId, shareId, user } = match.groups

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

check()
