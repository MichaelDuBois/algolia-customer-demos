import React, { Component } from "react";
import algoliasearch from "algoliasearch/lite";
import {
  InstantSearch,
  Hits,
  SearchBox,
  Pagination,
  RefinementList,
  Index,
  Configure
} from "react-instantsearch-dom";
import PropTypes from "prop-types";
import "./styles.css";

const searchClient = algoliasearch(
  "latency",
  "af044fb0788d6bb15f807e4420592bc5"
);

class App extends Component {
  state = {
    searchState: {},
    refinedFacets: []
  };
  onSearchStateChange = searchState => {
    let facetArr = [];
    if (searchState.refinementList["other.brand"]) {
      searchState.refinementList["other.brand"].forEach(el => {
        facetArr.push("brand:" + el);
      });
    }
    this.setState({
      refinedFacets: facetArr,
      searchState: {
        ...searchState
      }
    });
  };

  render() {
    return (
      <div>
        <header className="header">
          <h1 className="header-title">
            <a href="/">testfacets</a>
          </h1>
          <p className="header-subtitle">
            using{" "}
            <a href="https://github.com/algolia/react-instantsearch">
              React InstantSearch
            </a>
          </p>
        </header>

        <div className="container">
          <InstantSearch
            searchClient={searchClient}
            indexName="test_oliver"
            onSearchStateChange={this.onSearchStateChange}
          >
            <div className="search-panel">
              <div className="search-panel__results">
                <SearchBox
                  className="searchbox"
                  translations={{
                    placeholder: ""
                  }}
                />
                <RefinementList attribute="other.brand" />
                {/* Subindex */}
                <InstantSearch
                  searchClient={searchClient}
                  indexName="instant_search"
                >
                  <Index indexName="instant_search">
                    <Configure
                      facetFilters={this.state.refinedFacets}
                      hitsPerPage={5}
                    />

                    <h2>index: instant_search</h2>
                    <Hits />
                  </Index>
                </InstantSearch>
                // end sub index
                <Index indexName="test_oliver">
                  <Configure hitsPerPage={6} />
                  <h2>index: test_oliver</h2>
                  <Hits />
                </Index>
                <div className="pagination">
                  <Pagination />
                </div>
              </div>
            </div>
          </InstantSearch>
        </div>
      </div>
    );
  }
}

function Hit(props) {
  return (
    <article>
      <p>
        <code>{JSON.stringify(props.hit).slice(0, 100)}...</code>
      </p>
    </article>
  );
}

Hit.propTypes = {
  hit: PropTypes.object.isRequired
};

export default App;
