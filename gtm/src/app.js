/* global instantsearch algoliasearch */

const search = instantsearch({
  indexName: 'dev_product_index',
  searchClient: algoliasearch('S8EP2PEHAG', '3749297a158d67aec6d78748770f1bef'),
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
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      item: `
        <div class=”my-hit”
          data-insights-object-id="{{objectID}}"
          data-insights-position="{{__position}}"
          data-insights-query-id="{{__queryID}}">

          <img src="{{image}}" align="left" alt="{{name}}" />
          <div class="hit-name">
            {{#helpers.highlight}}{ "attribute": "name" }{{/helpers.highlight}}
          </div>
          <div class="hit-description">
            {{#helpers.highlight}}{ "attribute": "description" }{{/helpers.highlight}}
          </div>
          <div class="hit-price">\${{price}}</div>
          <div><a href="product.html?objectID={{objectID}}&queryID={{__queryID}}"> See Product </a></div>
        </div>
      `,
    },
  }),
  instantsearch.widgets.pagination({
    container: '#pagination',
  }),

  instantsearch.widgets.configure({
    clickAnalytics: true,
  }),
]);

search.start();
