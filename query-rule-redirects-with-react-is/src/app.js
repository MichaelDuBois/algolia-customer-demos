import React, { useCallback } from 'react'
import algoliasearch from 'algoliasearch/lite'
import {
  Configure,
  Hits,
  InstantSearch,
  Pagination,
  QueryRuleCustomData, // Algolia component used for redirection!
  RefinementList,
  SearchBox,
} from 'react-instantsearch-dom'
import Hit from './components/hit'
import './app.css'

const searchClient = algoliasearch('0UI9MOXMX5', '1d30c6a6ea8a7dfcc9797671c39723db')

// Full component for redirection
const QueryRuleRedirect = () => {
  const transformItems = useCallback((items) => {
    // Find the match
    const redirect = items.find((data) => Boolean(data.redirect))?.redirect
    // Redirect if there is a match
    if (redirect) window.location.href = redirect

    return []
  }, [])

  return <QueryRuleCustomData transformItems={transformItems}>{() => null}</QueryRuleCustomData>
}

const App = () => (
  <div className="ais-InstantSearch">
    <h1 className="title">Algolia React InstantSearch Redirects</h1>
    <p className="subtitle">
      Type <code>redirect</code> to get redirected to our community site!
    </p>
    <InstantSearch indexName="best_buy" searchClient={searchClient}>
      <QueryRuleRedirect /> {/* This MUST be inside the InstantSearch component */}
      <div className="left-panel">
        <h4>Category</h4>
        <RefinementList attribute="category" />
        <Configure hitsPerPage={8} />
      </div>
      <div className="right-panel">
        <SearchBox />
        <Hits hitComponent={Hit} />
        <Pagination />
      </div>
    </InstantSearch>
  </div>
)

export default App
