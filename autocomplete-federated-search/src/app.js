/* global algoliasearch instantsearch */
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';

import {
  autocomplete,
  getAlgoliaFacets,
  getAlgoliaResults,
} from '@algolia/autocomplete-js';
import { h, Fragment } from 'preact';

const searchClient = algoliasearch(
  'IG9MPJA4PF',
  '591a4a9eceb5c0865c8f17ab72a18e12'
);

const search = instantsearch({
  indexName: 'Product_301',
  searchClient,
});

// Create the Query Suggestions plugin
const querySuggestionsPlugin = createQuerySuggestionsPlugin({
  searchClient: searchClient,
  indexName: 'Product_301_query_suggestions',
  getSearchParams({ state }) {
    return { hitsPerPage: state.query ? 3 : 10 };
  },
});

autocomplete({
  container: '#autocomplete',
  placeholder: 'Search for products',
  plugins: [querySuggestionsPlugin],
  openOnFocus: true,
  getSources({ query, state }) {
    if (!query) {
      return [];
    }

    return [
      {
        sourceId: 'products',
        getItems() {
          return getAlgoliaResults({
            searchClient,
            queries: [
              {
                indexName: 'Product_301',
                query,
                params: {
                  hitsPerPage: 5,
                },
              },
            ],
          });
        },
        templates: {
          header() {
            return (
              <Fragment>
                <span className="aa-SourceHeaderTitle">Products</span>
                <div className="aa-SourceHeaderLine" />
              </Fragment>
            );
          },
          item({ item, components }) {
            return <ProductItem hit={item} components={components} />;
          },
          noResults() {
            return 'No products found';
          },
        },
      },

      {
        sourceId: 'categories',
        getItems({ query }) {
          return getAlgoliaFacets({
            searchClient,
            queries: [
              {
                indexName: 'Product_301',
                // make the facet searchable in dashboard
                facet: 'hierarchicalCategories.lvl1',
                params: {
                  facetQuery: query,
                  maxFacetHits: 2,
                },
              },
            ],
          });
        },
        templates: {
          header() {
            return (
              <Fragment>
                <span className="aa-SourceHeaderTitle">
                  Products Categories
                </span>
                <div className="aa-SourceHeaderLine" />
              </Fragment>
            );
          },
          item({ item }) {
            return <div>{item.label}</div>;
          },
        },
      },
      //
    ];
  },
});

// Add template for Product items
function ProductItem({ hit, components }) {
  return (
    <a href={hit.url} className="aa-ItemLink">
      <div className="aa-ItemContent">
        <div className="aa-ItemIcon aa-ItemIcon--picture aa-ItemIcon--alignTop">
          <img src={hit.image} alt={hit.name} width="40" height="40" />
        </div>
        <div className="aa-ItemContentBody">
          <div className="aa-ItemContentTitle">
            <components.Snippet hit={hit} attribute="name" />
          </div>
          <div className="aa-ItemContentDescription">
            From <strong>{hit.brand}</strong> in{' '}
            <strong>{hit.categories[0]}</strong>
          </div>
          {hit.rating > 0 && (
            <div className="aa-ItemContentDescription">
              <div style={{ display: 'flex', gap: 1, color: '#ffc107' }}>
                {Array.from({ length: 5 }, (_value, index) => {
                  const isFilled = hit.rating >= index + 1;

                  return (
                    <svg
                      key={index}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill={isFilled ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  );
                })}
              </div>
            </div>
          )}
          <div className="aa-ItemContentDescription" style={{ color: '#000' }}>
            <strong>${hit.price.toLocaleString()}</strong>
          </div>
        </div>
      </div>
      <div className="aa-ItemActions">
        <button
          className="aa-ItemActionButton aa-DesktopOnly aa-ActiveOnly"
          type="button"
          title="Select"
          style={{ pointerEvents: 'none' }}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M18.984 6.984h2.016v6h-15.188l3.609 3.609-1.406 1.406-6-6 6-6 1.406 1.406-3.609 3.609h13.172v-4.031z" />
          </svg>
        </button>
        <button
          className="aa-ItemActionButton"
          type="button"
          title="Add to cart"
        ></button>
      </div>
    </a>
  );
}

search.start();
