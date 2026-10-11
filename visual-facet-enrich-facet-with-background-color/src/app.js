/* global algoliasearch instantsearch */

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

const search = instantsearch({
  indexName: 'instant_search',
  searchClient,
});

/**
 * Facet values we want to add
 */
const facetMapping = {
  Metra: '#EEE8AA',
  GE: '#EEE8AA',
  HP: '#000000',
  Sony: '#FF5733 ',
};

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
    transformItems(items) {
      return items.map(item => ({
        ...item,
        // Here we add our extra attribute
        backgroundColour: facetMapping[item.label],
      }));
    },
    templates: {
      item: `
        <a href="{{url}}" style="{{#isRefined}}font-weight: bold{{/isRefined}}; 
        background-color:{{backgroundColour}}">
          <span>{{label}} ({{count}})</span>
        </a>
      `,
    },
  }),
  instantsearch.widgets.pagination({
    container: '#pagination',
  }),
]);

search.start();
