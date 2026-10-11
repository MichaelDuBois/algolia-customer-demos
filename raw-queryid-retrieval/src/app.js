/* global algoliasearch instantsearch */
const algoliaClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

const searchClient = {
  search(requests) {
    return algoliaClient.search(requests);
  },
  ...algoliaClient,
};

const search = instantsearch({
  indexName: 'instant_search',
  searchClient: algoliaClient,
});

search.addWidgets([
  instantsearch.widgets.configure({
    clickAnalytics: true,
  }),
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
  instantsearch.widgets.pagination({
    container: '#pagination',
  }),
]);

search.start();
