/* global instantsearch algoliasearch */

const search = instantsearch({
  indexName: 'dev_product_index',
  searchClient: algoliasearch('S8EP2PEHAG', '3749297a158d67aec6d78748770f1bef'),
});

const querySuggestionHits = instantsearch.widgets.hits({
  container: '#hits-qs',
  templates: {
    item: `
      <div>
      {{query}}
      </div>
    `,
  },
});

search.addWidgets([
  instantsearch.widgets.searchBox({
    container: '#searchbox',
  }),
  instantsearch.widgets.clearRefinements({
    container: '#clear-refinements',
  }),
  instantsearch.widgets.refinementList({
    container: '#brand-list',
    attribute: 'brand',
  }),

  instantsearch.widgets
    .index({
      indexName: 'dev_product_index_query_suggestions',
    })
    .addWidgets([
      querySuggestionHits,
      instantsearch.widgets.configure({
        hitsPerPage: 4,
      }),
    ]),

  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      item: `
        <div>
          <img src="{{image}}" align="left" alt="{{name}}" />
          <div class="hit-name">
            {{#helpers.highlight}}{ "attribute": "name" }{{/helpers.highlight}}
          </div>
          <div class="hit-description">
            {{#helpers.highlight}}{ "attribute": "description" }{{/helpers.highlight}}
          </div>
          <div class="hit-price">\${{price}}</div>
        </div>
      `,
    },
  }),
  instantsearch.widgets.pagination({
    container: '#pagination',
  }),
]);

search.start();
