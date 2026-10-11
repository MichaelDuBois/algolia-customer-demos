/* global algoliasearch instantsearch */

const searchClient = algoliasearch(
  'testing78Z9OD0TCK',
  'd18844ce6e75f713f36a0fbe3262f9fa'
);

const search = instantsearch({
  indexName: 'sit_escape_content',
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
    console.log(search.renderState.sit_escape_content.hits);
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
  <h1>{{#helpers.highlight}}{ "attribute": "headline" }{{/helpers.highlight}}</h1>
</article>
`,
    },
  }),
  instantsearch.widgets.hierarchicalMenu({
    container: '#hierarchical-menu',
    attributes: [
      'locationsHierarchy.lvl0',
      'locationsHierarchy.lvl1',
      'locationsHierarchy.lvl2',
      'locationsHierarchy.lvl3',
    ],
    separator: ' / ',
    rootPath: 'Oceania' // Dynamic Value
  }),
  // 4. add custom currentRefinement widget
  customCurrentRefinements({}),
]);

search.start();
