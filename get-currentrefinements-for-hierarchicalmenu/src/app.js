/* global algoliasearch instantsearch */

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

const search = instantsearch({
  indexName: 'instant_search',
  searchClient,
});

const renderCurrentRefinements = (renderOptions, isFirstRender) => {
  const { items, refine, widgetParams } = renderOptions;

  if (items.length) {
    // 2. get hierarchical category name
    const categoryName = items[0].refinements[0].value;
    const categoryNameEl = document.getElementById('category-name');
    categoryNameEl.innerHTML = categoryName;

    // 3. count depth of hierarchical menu
    // based on count of your separator character
    const hierarchicalCount = (categoryName.match(/\>/g) || []).length;
    console.log(categoryName);
    const categoryDescriptionEl = document.getElementById(
      'category-description'
    );
    //4. display the appropriate category Description
    // for example, you might get this value by accessing the hits
    console.log(search.renderState.instant_search.hits);
    categoryDescriptionEl.innerHTML = `This is ${hierarchicalCount} levels deep. Display the level ${hierarchicalCount} categoryDescriptions`;

    console.log(items);
  }
};

// 1. create custom currentRefinement
// to access currentRefinement values
const customCurrentRefinements = instantsearch.connectors.connectCurrentRefinements(
  renderCurrentRefinements
);

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
  instantsearch.widgets.hierarchicalMenu({
    container: '#hierarchical-menu',
    attributes: [
      'hierarchicalCategories.lvl0',
      'hierarchicalCategories.lvl1',
      'hierarchicalCategories.lvl2',
      'hierarchicalCategories.lvl3',
    ],
  }),
  // 4. add custom currentRefinement widget
  customCurrentRefinements({}),
]);

search.start();
