import React, { useEffect, useState } from 'react'
import algoliasearch from 'algoliasearch/lite'
import { Configure, Hits, InstantSearch, Pagination, SearchBox, useSearchBox } from 'react-instantsearch-hooks-web'
import { Header, Hit, RefinementList } from './components'
import './app.css'

const algoliaClient = algoliasearch('latency', '6be0576ff61c053d5f9a3225e2a90f76')
let isInitialRequest = true

const searchClient = {
  ...algoliaClient,
  search(requests) {
    // Avoid initial request, see https://algolia.com/doc/guides/building-search-ui/going-further/conditional-requests/react-hooks/#detecting-empty-search-requests
    if (isInitialRequest) {
      isInitialRequest = false

      return Promise.resolve({
        results: requests.map(() => ({
          hits: [],
          nbHits: 0,
          nbPages: 0,
          page: 0,
          processingTimeMS: 0,
        })),
      })
    }

    return algoliaClient.search(requests)
  },
}

const INITIAL_QUERY = 'iphone'

const CustomSearchBox = (props) => {
  const [searchQuery] = useState(INITIAL_QUERY)
  const { refine } = useSearchBox(props)

  useEffect(() => {
    refine(searchQuery)
  }, [refine, searchQuery])

  return <SearchBox className="searchbox" {...props} />
}

const App = () => (
  <>
    <Header />
    <div className="container">
      <InstantSearch searchClient={searchClient} indexName="instant_search">
        <Configure hitsPerPage={8} />
        <div className="search-panel">
          <div className="search-panel__filters">
            <RefinementList attribute="brand" searchable={false} />
          </div>

          <div className="search-panel__results">
            <CustomSearchBox placeholder="" />
            <Hits hitComponent={Hit} />

            <div className="pagination">
              <Pagination />
            </div>
          </div>
        </div>
      </InstantSearch>
    </div>
  </>
)

export default App
