/* global algoliasearch instantsearch */

const searchClient = algoliasearch(
  'P28KR2J94G',
  '87211e421815aff91715251fd29208a8'
);

const search = instantsearch({
  indexName: 'test_products_algolia',
  searchClient,
  searchFunction: function (helper) {
    // 1. On non-empty query, begin check of refinement lists
    if (helper.state.query !== '') {
      // 3. Use search.renderState to access refinementList state
      console.log(search.renderState);
      const refinementLists =
        search.renderState.test_products_algolia.refinementList;
      // 4. iterate over refinementList facets
      for (var facet in refinementLists) {
        console.log(facet);
        if (facet.includes('variants')) {
          const refinementListContainer = document.getElementById(
            `${facet.replace('variants.', '')}-container`
          );
        } else {
          document.getElementById(`${facet}-container`);
        }
        // inspect facet value counts
        const facetValues = refinementLists[facet].items;
        // 5. Apply any conditional display as you wish
        const shouldNotDisplayFacet = facetValues.some(
          (value) => value.count < 5
        );
        // Trigger: If facet value count is less than 5
        // Condition: Hide the facet container
        if (shouldNotDisplayFacet) {
          refinementListContainer.style.visibility = 'hidden';
        } else {
          refinementListContainer.style.visibility = 'visible';
        }
      }
    }
    // 2. On empty query, do nothing
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
  <h1>{{#helpers.highlight}}{ "attribute": "title" }{{/helpers.highlight}}</h1>
</article>
`,
    },
  }),
  instantsearch.widgets.refinementList({
    container: '#brand',
    attribute: 'brand',
  }),
  instantsearch.widgets.refinementList({
    container: '#shoe_sizes',
    attribute: 'variants.shoe_sizes',
  }),
  instantsearch.widgets.pagination({
    container: '#pagination',
  }),
]);

search.start();
