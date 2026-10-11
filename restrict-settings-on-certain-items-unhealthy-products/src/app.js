import algoliasearch from 'algoliasearch/lite'
import { useMemo } from 'react'
import { Highlight, Hits, InstantSearch, SearchBox } from 'react-instantsearch-dom'
import './app.css'

const searchClient = algoliasearch('0UI9MOXMX5', '1d30c6a6ea8a7dfcc9797671c39723db')

const Hit = ({ hit }) => {
  const isHfss = useMemo(() => hit.healthinessScore === 0, [hit.healthinessScore])
  const attributes = useMemo(() => (isHfss ? 'hfssAttributes' : 'attributes'), [isHfss])

  return (
    <>
      {isHfss && <div className="ais-Hits-item__ribbon">HFSS</div>}
      <img src={hit.image} alt={`${attributes}.name`} className="ais-Hits-item__img" />
      <div>
        <div className="ais-Hits-item__name">
          <Highlight attribute={`${attributes}.name`} hit={hit} />
        </div>
        <div className="ais-Hits-item__description">
          <Highlight attribute={`${attributes}.description`} hit={hit} />
        </div>
        {hit.price && <div className="ais-Hits-item__price">£{hit.price.toFixed(2)}</div>}
      </div>
    </>
  )
}

const App = () => (
  <InstantSearch searchClient={searchClient} indexName="hfss_search_multi_attributes_grouped">
    <div className="container">
      <SearchBox />
      <Hits hitComponent={Hit} />
    </div>
  </InstantSearch>
)

export default App
