import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import {
  InstantSearch,
  Configure,
  DynamicWidgets,
  Hits,
  SearchBox,
  RefinementList,
  Pagination,
  Highlight,
  useRefinementList,
  useRange,
  RangeInput,
  HierarchicalMenu,
  useHierarchicalMenu,
} from 'react-instantsearch-hooks-web';
import { simple } from 'instantsearch.js/es/lib/stateMappings';
import { Panel } from './Panel';
import './App.css';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

function App() {
  const VirtualRefinementList = (props) => {
    useRefinementList(props);
    return null;
  };

  const VirtualPriceRange = (props) => {
    useRange(props);
    return null;
  };

  const VirtualHierarchicalMenu = (props) => {
    useHierarchicalMenu(props);
    return null;
  };

  const routing = {
    stateMapping: simple(),
  };

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
        <InstantSearch
          searchClient={searchClient}
          indexName="instant_search"
          routing={routing}
        >
          <Configure hitsPerPage={8} />
          <VirtualRefinementList attribute="brand" />
          <VirtualRefinementList attribute="type" />
          <VirtualPriceRange attribute="price" />
          <VirtualHierarchicalMenu
            attributes={[
              'hierarchicalCategories.lvl0',
              'hierarchicalCategories.lvl1',
              'hierarchicalCategories.lvl2',
              'hierarchicalCategories.lvl3',
            ]}
          />
          <div className="search-panel">
            <div className="search-panel__filters">
              <DynamicWidgets>
                <Panel header="Brand">
                  <RefinementList attribute="brand" />
                </Panel>
                <Panel header="Type">
                  <RefinementList attribute="type" />
                </Panel>
                <Panel header="Price">
                  <RangeInput attribute="price" />
                </Panel>
                <Panel header="Categories">
                  <HierarchicalMenu
                    attributes={[
                      'hierarchicalCategories.lvl0',
                      'hierarchicalCategories.lvl1',
                      'hierarchicalCategories.lvl2',
                      'hierarchicalCategories.lvl3',
                    ]}
                  />
                </Panel>
              </DynamicWidgets>
            </div>

            <div className="search-panel__results">
              <SearchBox
                className="searchbox"
                translations={{
                  placeholder: '',
                }}
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

export default App;
