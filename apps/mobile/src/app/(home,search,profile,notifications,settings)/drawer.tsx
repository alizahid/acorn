import { useState } from 'react'

import { CommunitiesList } from '~/components/communities/list'
import { CommunitySearchBox } from '~/components/communities/search-box'
import { useList } from '~/hooks/list'

export default function Screen() {
  const listProps = useList({
    header: false,
  })

  const [query, setQuery] = useState('')

  return (
    <>
      <CommunitySearchBox onChange={setQuery} value={query} />

      <CommunitiesList listProps={listProps} query={query} />
    </>
  )
}
