import algoliasearch from 'algoliasearch';
import instantsearch from 'instantsearch.js';
import { configure, hits, searchBox, stats } from 'instantsearch.js/es/widgets';

import { locationMenu, webToggle } from './widgets';

const search = instantsearch({
  indexName: 'stellantis_sandbox',
  searchClient: algoliasearch('ZH6901PX1J', 'd850a12faaa943ad0653aeffa19ad564'),
});

search.addWidgets([
  configure({
    facets: ['dealerGroupName', 'isExcluWeb'],
    hitsPerPage: 100,
    optionalFilters: 'isExcluWeb:-true',
  }),
  stats({
    container: '#stats',
  }),
  searchBox({
    container: '#searchbox',
  }),

  locationMenu({
    attribute: 'dealerGroupName',
    container: '#menu-select-dealer-group-name',
    toggleAttribute: 'isExcluWeb',
    toggleContainer: '#is-exclu-web',
  }),
  webToggle({
    attribute: 'isExcluWeb',
    container: '#is-exclu-web',
    menuAttribute: 'dealerGroupName',
    menuContainer: '#menu-select-dealer-group-name',
  }),

  hits({
    container: '#hits',
    templates: {
      item: `
        <div>
          <div class="hit-brand">
            {{#helpers.highlight}}{ "attribute": "brand" }{{/helpers.highlight}}
          </div>
          <div class="hit-model">
            {{#helpers.highlight}}{ "attribute": "model" }{{/helpers.highlight}}
          </div>
          <div class="hit-localisation">
           {{#helpers.highlight}}{ "attribute": "localisation" }{{/helpers.highlight}}
          </div>
          {{isExcluWeb}}
        </div>
      `,
    },
  }),
]);

search.start();
