import React, { useCallback } from 'react'
import algoliasearch from 'algoliasearch/lite'
import {
  ClearRefinements,
  Configure,
  Hits,
  InstantSearch,
  Pagination,
  QueryRuleCustomData, // Algolia component used to redirect!
  RefinementList,
  SearchBox,
} from 'react-instantsearch-dom'
import Hit from './components/hit'
import './app.css'

const searchClient = algoliasearch('0UI9MOXMX5', '1d30c6a6ea8a7dfcc9797671c39723db')

// Full component to redirect
const QueryRuleRedirect = () => {
  const transformItems = useCallback(items => {
    // Check for matches
    const match = items.find(data => Boolean(data.redirect))?.redirect
    console.log(match)

    // Select the redirect button (if exists)
    let button = document.querySelector('#btn-redirect')

    // Remove the button and return if no matches
    if (!match) {
      if (button) button.remove()
      return []
    }

    // Get the match properties
    const { label, path } = match
    if (!label || !path) return []

    // Create or update the button
    if (!button) {
      const container = document.querySelector('.header')
      button = document.createElement('a')
      button.id = 'btn-redirect'
      container.appendChild(button)

      // Fake event for demonstration purposes
      button.addEventListener('click', e => {
        e.preventDefault()
        alert('To do: redirect to your delivery page!')
      })
    }

    button.href = path
    button.textContent = label

    return []
  }, [])

  return <QueryRuleCustomData transformItems={transformItems}>{() => null}</QueryRuleCustomData>
}

const App = () => (
  <div className="ais-InstantSearch">
    <h1 className="title">React InstantSearch Redirects</h1>
    <div className="header">
      <p className="subtitle">
        Search for <code>delivery</code> or <code>shipping</code> and see Algolia rules in action!
      </p>
      {/* Here the button will be injected */}
    </div>
    <InstantSearch indexName="instant_search" searchClient={searchClient}>
      <QueryRuleRedirect /> {/* This MUST be inside the InstantSearch component */}
      <div className="left-panel">
        <ClearRefinements />
        <RefinementList attribute="brand" />
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
