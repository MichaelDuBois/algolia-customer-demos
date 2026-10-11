import algoliasearch from 'algoliasearch/lite';
import instantsearch from 'instantsearch.js/dist/instantsearch.production.min';

const search = instantsearch({
  searchClient: algoliasearch('SXDY3EO0TR', 'a846bb11aaa2a2ae725a722206ec44a6'),
  indexName: 'shoes',
});

search.addWidgets([
  instantsearch.widgets.configure({
    facetingAfterDistinct: true,
  }),
  instantsearch.widgets.searchBox({
    container: '#searchbox',
    autofocus: false,
  }),
  instantsearch.widgets.refinementList({
    container: '#brand-list',
    attribute: 'brand',
    limit: 20,
  }),
  instantsearch.widgets
    .index({
      indexName: 'shoes',
    })
    .addWidgets([
      instantsearch.widgets.configure({
        maxValuesPerFacet: 20,
        facetingAfterDistinct: false,
      }),
      instantsearch.widgets.stats({
        container: '#stats',
      }),
      instantsearch.widgets.refinementList({
        container: '#brand-list-2',
        attribute: 'colour',
        limit: 20,
      }),
      instantsearch.widgets.hits({
        container: '#hits',
        templates: {
          item: `
            <article>
              <h1>{{{title}}}</h1>
              <p>{{{colour}}}</p>
              <p>{{{brand}}}</p>
              <p>{{{objectID}}}</p>
            </article>
          `,
        },
      }),
    ]),
  instantsearch.widgets.pagination({
    container: '#pagination',
  }),
]);

search.start();
