function check() {
  const match = window.location.href.match(
    /^(?:https?:\/\/)?(?:(?:www|amp|m|i)\.)?(?:(?:reddit\.com))(?:\/r\/(\w+)(?:\/(?:comments\/(\w+)(?:\/[^/]+(?:\/(?:comment\/)?(\w+))?)?|wiki\/([^/?]+)|s\/(\w+)))?(?:\/?.*?(?:[?&]context=(\d+))?)?|\/user\/(\w+)\/(?:m\/(\w+)|comments\/(\w+)(?:\/[^/]+)?(?:\/?.*?(?:[?&]context=(\d+))?)?))/i,
  )

  if (match) {
    window.stop()

    const community = match[1]
    const postId = match[2] || match[9]
    const commentId = match[3]
    const shareId = match[5]
    const context = match[6] || match[10]
    const user = match[7]
    const feed = match[8]

    if (postId && commentId && context) {
      window.location.replace(
        `acorn:///posts/${postId}?commentId=${commentId}&context=${context}`,
      )

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

    if (shareId) {
      window.location.replace(window.location.href)

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
