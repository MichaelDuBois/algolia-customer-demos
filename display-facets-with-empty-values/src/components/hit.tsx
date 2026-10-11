import React from 'react'
import { Highlight } from 'react-instantsearch-hooks-web'

const Hit = ({ hit }) => (
  <article>
    <h1>
      <Highlight attribute="name" hit={hit} />
    </h1>
    <p>
      <Highlight attribute="description" hit={hit} />
    </p>
  </article>
)

export default Hit
