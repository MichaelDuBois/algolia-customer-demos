import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import {
  InstantSearch,
  Hits,
  SearchBox,
  RefinementList,
  Pagination,
  Highlight,
} from 'react-instantsearch-dom';
import PropTypes from 'prop-types';
import './App.css';

let isActiveSearch = false;

class Deferred {
  constructor(requests) {
    this.promise = new Promise((resolve, reject) => {
      this.reject = reject;
      this.resolve = resolve;
    });
  }

  setRequests(requests) {
    this.requests = requests;
  }
}

const deferredFirstSearch = new Deferred();

const algoliaClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

const doActivateSearch = function (event) {
  if (!isActiveSearch) {
    isActiveSearch = true;
    //runs the empty state query
    deferredFirstSearch.resolve(
      algoliaClient.search(deferredFirstSearch.requests)
    );
  }
};

const searchClient = {
  ...algoliaClient,
  search(requests) {
    /*
    //full reject if empty query
    if (
      requests.every(({ params }) => !params.query || params.query.length == 0)
    ) {
      return Promise.reject();
    }*/

    if (!isActiveSearch) {
      deferredFirstSearch.setRequests(requests);
      return deferredFirstSearch.promise;
    }

    return algoliaClient.search(requests);
  },
};

function App() {
  return (
    <div>
      <header className="header">
        <h1 className="header-title">
          <a href="/">react-instantsearch-app</a>
        </h1>
        <p className="header-subtitle">
          using{' '}
          <a href="https://github.com/algolia/react-instantsearch">
            React InstantSearch
          </a>
        </p>
      </header>

      <div className="container">
        <InstantSearch searchClient={searchClient} indexName="instant_search">
          <div className="search-panel">
            <div className="search-panel__filters">
              <RefinementList attribute="brand" />
            </div>

            <div className="search-panel__results">
              <SearchBox
                className="searchbox"
                translations={{
                  placeholder: '',
                }}
                onFocus={doActivateSearch}
              />
              <Hits hitComponent={Hit} />

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

function Hit(props) {
  return (
    <article>
      <h1>
        <Highlight attribute="name" hit={props.hit} />
      </h1>
      <p>
        <Highlight attribute="description" hit={props.hit} />
      </p>
    </article>
  );
}

Hit.propTypes = {
  hit: PropTypes.object.isRequired,
};

export default App;
