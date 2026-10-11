import React, { Component } from 'react';
import PropTypes from 'prop-types';
import algoliasearch from 'algoliasearch/lite';
import {
  InstantSearch,
  Configure,
  Hits,
  Highlight,
  connectSearchBox,
  Index,
  RefinementList,
} from 'react-instantsearch-dom';
import Autocomplete from './Autocomplete';
import './App.css';

const VirtalSearchBox = connectSearchBox(() => null);

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

const emptyResult = {
  hits: [],
};
const oldSearch = searchClient.search;
searchClient.search = function search(requests) {
  console.log(requests.slice(1), searchClient.search);
  return oldSearch(requests.slice(1)).then(({ results }) => {
    return {
      results: [emptyResult, ...results],
    };
  });
};

class App extends Component {
  state = {
    query: '',
  };

  onSuggestionSelected = (_, { suggestion }) => {
    this.setState({
      query: suggestion.query,
    });
  };

  onSuggestionCleared = () => {
    this.setState({
      query: '',
    });
  };

  render() {
    const { query } = this.state;

    return (
      <div className="container">
        <h1>React InstantSearch - Results page with autocomplete</h1>
        <InstantSearch indexName="__root__" searchClient={searchClient}>
          <Index indexName="instantsearch_query_suggestions">
            <Configure hitsPerPage={5} />
            <Autocomplete
              onSuggestionSelected={this.onSuggestionSelected}
              onSuggestionCleared={this.onSuggestionCleared}
            />
          </Index>

          <Index indexName="instant_search">
            <RefinementList attribute="brand" />
            <VirtalSearchBox defaultRefinement={query} />
            <Hits hitComponent={Hit} />
          </Index>
        </InstantSearch>
      </div>
    );
  }
}

function Hit(props) {
  return (
    <div>
      <Highlight attribute="name" hit={props.hit} />
    </div>
  );
}

Hit.propTypes = {
  hit: PropTypes.object.isRequired,
};

export default App;
