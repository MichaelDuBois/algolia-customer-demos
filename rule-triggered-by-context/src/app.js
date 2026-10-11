/* global algoliasearch instantsearch */

const searchClient = algoliasearch(
  'BC4LQIWSAB',
  '1faeaf955007cf7d70ab0526b41cc0ab'
);

const search = instantsearch({
  indexName: 'codesandbox_index2',
  searchClient,
});

// Own buisness logic
let contexts = ['ais-Type-Music'];

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
  // This has been added so we can see that the rule has been triggered by the context
  instantsearch.widgets.queryRuleCustomData({
    container: '#banner',
    templates: {
      default: `
        {{#items}}
          <p>{{text}}</a></p>
        {{/items}}
      `,
    },
  }),

  instantsearch.widgets.pagination({
    container: '#pagination',
  }),
  instantsearch.widgets.configure({
    // This triggers the rule we want
    ruleContexts: contexts,
    // Don't need this for the rule it is just adding a filter
    //filters: 'Type:Music',
  }),
]);

search.start();
