/* global algoliasearch instantsearch */
import customHitsWidget from './customHitsWidget';
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
  instantsearch.widgets.refinementList({
    container: '#brand-list',
    attribute: 'brand',
  }),
  instantsearch.widgets.index({
    indexId: 'query_suggestions',
    indexName: 'instant_search_demo_query_suggestions',
  }),
  instantsearch.widgets.index({
    indexId: 'ads',
    indexName: 'instant_search',
  }),
  instantsearch.widgets.index({
    indexId: 'promoted',
    indexName: 'instant_search',
  }),
  instantsearch.widgets.index({ indexName: 'instant_search' }).addWidgets([
    customHitsWidget({
      container: '#hits',
      injected: [
        { indexId: 'ads', position: 2, properties: { ad: 'ad' } },
        { indexId: 'ads', position: 4, properties: { ad: 'ad' } },
        { indexId: 'ads', position: 4, properties: { ad: 'ad' } },
        {
          indexId: 'promoted',
          position: 8,
          properties: { promoted: 'promo' },
        },
        {
          indexId: 'promoted',
          position: 9,
          properties: { promoted: 'promo' },
        },
        {
          indexId: 'promoted',
          position: 10,
          properties: { promoted: 'promo' },
        },
        {
          indexId: 'query_suggestions',
          position: 3,
          count: 5,
          properties: { qs: 'query suggestions' },
        },
      ],
      templates: {
        item: (hit) => {
          if (hit.ad) {
            return `<li><strong>Ad</strong></li>`;
          }
          if (hit.promoted) {
            return `<li><strong>Promoted</strong></li>`;
          }
          if (hit.qs) {
            console.log(hit);
            return (
              `<li>Query suggestions: <ul>` +
              hit.hits.map((query) => `<li>${query.query}</li>`).join('') +
              `</ul></li>`
            );
          }
          return `<li>${instantsearch.highlight({
            attribute: 'name',
            hit,
          })}</li>`;
        },
      },
    }),
    instantsearch.widgets.pagination({
      container: '#pagination',
    }),
  ]),
]);

search.start();
