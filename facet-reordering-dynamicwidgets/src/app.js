/* global algoliasearch instantsearch */

const searchClient = algoliasearch(
  '94IA10ZQ15',
  '81c06064842fb5879c0e4526377f44b1'
);

const search = instantsearch({
  indexName: 'ecommerce',
  searchClient,
});

search.addWidgets([
  instantsearch.widgets.searchBox({
    container: '#searchbox',
  }),
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      item: `
<article>
  <h1>{{#helpers.highlight}}{ "attribute": "name" }{{/helpers.highlight}}</h1>
  <p>{{#helpers.highlight}}{ "attribute": "description" }{{/helpers.highlight}}</p>
</article>
`,
    },
  }),
  instantsearch.widgets.refinementList({
    container: '#brand-list',
    attribute: 'brand',
  }),
  instantsearch.widgets.menu({
    container: '#category-list',
    attribute: 'categories',
  }),
  instantsearch.widgets.pagination({
    container: '#pagination',
  }),
  instantsearch.widgets.EXPERIMENTAL_dynamicWidgets({
    container: '#container',
    widgets: [
      (container) =>
        instantsearch.widgets.refinementList({
          container,
          attribute: 'brand',
          limit: 100,
        }),
      (container) =>
        instantsearch.widgets.menu({ container, attribute: 'categories' }),
    ],
  }),
]);

console.log('Frigidaire and Cell Phones were pinned!');

search.start();
