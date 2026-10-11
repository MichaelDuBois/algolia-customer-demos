/** @jsx h */
import { autocomplete, getAlgoliaResults } from '@algolia/autocomplete-js';
import algoliasearch from 'algoliasearch';
import { h } from 'preact';

import '@algolia/autocomplete-theme-classic';

const searchClient = algoliasearch(
  '68TJZ58YJR',
  '8c32aba8b5d875e32a740ac7c0138dad'
);

autocomplete({
  container: '#autocomplete',
  placeholder: 'Brand name display',
  getSources({ query }) {
    return [
      {
        sourceId: 'items',
        getItems() {
          return getAlgoliaResults({
            searchClient,
            queries: [
              {
                indexName: 'spencer_williams_electronics',
                query,
              },
            ],
          });
        },
        templates: {
          item({ item, components }) {
            return (
              <div class="product-image">
                <div class="image">
                  <img
                    src={item.image}
                    alt={item.name}
                    width="40"
                    height="40"
                  />
                </div>
                <p>{item.name}</p>
              </div>
            );
          },
          noResults() {
            return 'No matching items.';
          },
        },
      },
    ];
  },
});
