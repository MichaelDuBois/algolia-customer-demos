/* global algoliasearch instantsearch */

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

const search = instantsearch({
  indexName: 'instant_search',
  searchClient,
});

search.addWidgets([
  instantsearch.widgets.searchBox({
    container: '#searchbox',
  }),
  instantsearch.widgets
    .index({
      indexName: 'instant_search',
      indexId: 'boost_products',
    })
    .addWidgets([
      instantsearch.widgets.configure({
        // use hitsPerPage to limit product displayed
        hitsPerPage: 20,
        // use filters to locate specific suppliers
        filters: 'brand:HP OR brand:Lenovo OR brand:Dell',
      }),
      instantsearch.widgets.hits({
        container: '#boost_hits',
        transformItems(items) {
          console.log(items);
          const key = 'brand';
          const arrayUniqueByKey = [
            ...new Map(items.map((item) => [item[key], item])).values(),
          ];
          return arrayUniqueByKey;
        },
        templates: {
          item: `
<article>
  <h1>{{#helpers.highlight}}{ "attribute": "name" }{{/helpers.highlight}}</h1>
  <p>{{#helpers.highlight}}{ "attribute": "description" }{{/helpers.highlight}}</p>
</article>
`,
        },
      }),
    ]),
  // Organic hits
  instantsearch.widgets
    .index({
      indexName: 'instant_search',
      indexId: 'organic_products',
    })
    .addWidgets([
      instantsearch.widgets.configure({
        hitsPerPage: 8,
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
      instantsearch.widgets.pagination({
        container: '#pagination',
      }),
    ]),
]);

search.start();
