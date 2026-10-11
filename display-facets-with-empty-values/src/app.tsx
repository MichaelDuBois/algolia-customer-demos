import React from 'react'
import { Configure, Hits, InstantSearch, SearchBox } from 'react-instantsearch-hooks-web'
import { client } from './search'
import { Header, Hit, RefinementList } from './components'
import './app.css'

const App = () => (
  <>
    <Header title="Display empty facets values" />

    <div className="container">
      <InstantSearch searchClient={client} indexName="instant_search">
        <Configure hitsPerPage={8} />
        <div className="search-panel">
          <div className="search-panel__filters">
            <RefinementList attribute="brand" showAll />
          </div>

          <div className="search-panel__results">
            <SearchBox placeholder="Find a product" className="searchbox" />
            <Hits hitComponent={Hit} />
          </div>
        </div>
      </InstantSearch>
    </div>
  </>
)

export default App
