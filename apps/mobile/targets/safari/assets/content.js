function check() {
  const match = window.location.href.match(
    /^(?:https?:\/\/)?(?:(?:www|amp|m|i)\.)?(?:(?:reddit\.com))\/r\/(\w+)(?:\/comments\/(\w+)(?:\/\w+\/(\w+)(?:\/?.*?[?&]context=(\d+))?)?)?/i,
  )

  if (match) {
    window.stop()

    const community = match[1]
    const postId = match[2]
    const commentId = match[3]
    const context = match[4]

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
      window.location.replace(`acorn://posts//${postId}`)

      return
    }

    window.location.replace(`acorn:///communities/${community}`)
  }
}

check()
