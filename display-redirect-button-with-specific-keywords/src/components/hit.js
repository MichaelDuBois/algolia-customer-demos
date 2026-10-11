import React, { useMemo } from 'react'
import { Highlight } from 'react-instantsearch-dom'

const Hit = ({ hit }) => {
  const { description: fullDescription, image, name, price } = hit
  const description = useMemo(
    () => (fullDescription.length > 100 ? `${fullDescription.slice(0, 100)}...` : fullDescription),
    [fullDescription]
  )

  return (
    <>
      <img src={image} alt={name} className="ais-Hits-item__img" />
      <h4 className="ais-Hits-item__name">
        <Highlight attribute="name" hit={hit} />
      </h4>
      <p className="ais-Hits-item__description">{description}</p>
      <div className="ais-Hits-item__price">${price}</div>
    </>
  )
}

export default Hit
