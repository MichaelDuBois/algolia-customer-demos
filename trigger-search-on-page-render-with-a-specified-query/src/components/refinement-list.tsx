import React from 'react'
import { RefinementList as RefinementListBase, useInstantSearch } from 'react-instantsearch-hooks-web'
import Panel from './panel'

const RefinementList = ({ attribute, ...props }) => {
  const a = useInstantSearch()
  console.log(a)

  return (
    <Panel header={attribute}>
      <RefinementListBase attribute={attribute} showMore searchable {...props} />
    </Panel>
  )
}

export default RefinementList
