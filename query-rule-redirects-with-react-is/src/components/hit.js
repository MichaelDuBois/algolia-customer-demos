import React from 'react'
import { Highlight } from 'react-instantsearch-dom'

const Hit = ({ hit }) => (
  <div>
    <img src={hit.image} align="left" alt={hit.name} className="ais-Hits-item__img" />
    <div className="ais-Hits-item__name">
      <Highlight attribute="name" hit={hit} />
    </div>
  </div>
)

export default Hit
