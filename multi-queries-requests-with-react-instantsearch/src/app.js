import algoliasearch from 'algoliasearch/lite'
import React from 'react'
import {
  InstantSearch,
  Index,
  Configure,
  Hits,
  SearchBox,
  Highlight,
} from 'react-instantsearch-dom'
import './app.css'

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
)

const Hit = ({ hit }) => (
  <div>
    <Highlight attribute="name" hit={hit} />
  </div>
)

const App = () => (
  <InstantSearch indexName="instant_search" searchClient={searchClient}>
    <h2>
      Algolia React InstantSearch -{' '}
      <a
        href="https://www.algolia.com/doc/rest-api/search/#search-multiple-indices"
        target="_blank"
        rel="noreferrer"
      >
        Multiple queries requests
      </a>
    </h2>

    <SearchBox />

    {/* Main index, following main config */}
    <h3>
      <code>instant_search</code>
    </h3>
    <Configure hitsPerPage={8} />
    <Hits hitComponent={Hit} />

    {/* Main index, different config */}
    <Index indexName="instant_search" indexId="custom">
      <h3>
        <code>instant_search</code> w/ only 5 starts rating
      </h3>
      <Configure hitsPerPage={4} filters="rating:5" />
      <Hits hitComponent={Hit} />
    </Index>

    {/* Other index: instant_search_price_desc */}
    <Index indexName="instant_search_price_desc">
      <h3>
        <code>instant_search_price_desc</code>
      </h3>
      <Configure hitsPerPage={16} />
      <Hits hitComponent={Hit} />
    </Index>
  </InstantSearch>
)

export default App
