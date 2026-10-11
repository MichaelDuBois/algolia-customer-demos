const { algoliasearch, instantsearch } = window;

const searchClient = algoliasearch(
  '94IA10ZQ15',
  '81c06064842fb5879c0e4526377f44b1'
);

const search = instantsearch({
  indexName: 'ecommerce',
  searchClient,
  searchFunction(helper) {
    if (helper.state.query.length && helper.state.query.includes('&')) {
      helper.setQueryParameter('optionalWords', helper.state.query);
    }
    helper.search();
  },
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
  instantsearch.widgets.stats({
    container: '#stats',
  }),
  instantsearch.widgets.pagination({
    container: '#pagination',
  }),
]);

search.start();
