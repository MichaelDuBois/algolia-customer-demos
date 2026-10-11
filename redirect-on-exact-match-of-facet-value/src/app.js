/* global algoliasearch instantsearch */

const searchClient = algoliasearch(
  'SYZEVV63H0',
  'c56308e1435d05c153bd5365082704d8'
);

const search = instantsearch({
  indexName: 'my_redirect_pdp_index',
  searchClient,
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
  <h1>{{{name}}}</h1>
  <p>ISBN: {{{ISBN}}}</p>
</article>
`,
    },
  }),
  instantsearch.widgets.queryRuleCustomData({
    container: '#customData',
    templates: {
      default: '',
    },
    transformItems(items) {
      // Step 1: Detect the userData object
      const match = items.find((data) => Boolean(data.isbn_match));

      if (match && match.isbn_match) {
        console.log(`Matched: ${JSON.stringify(match)}`);
        // Step 2: Retrieve the url from the hit
        // search.renderState is all data from widgets
        // https://www.algolia.com/doc/api-reference/widgets/render-state/js/
        const query = search.renderState.my_redirect_pdp_index.searchBox.query;
        const hit = search.renderState.my_redirect_pdp_index.hits.hits[0];
        const redirectUrl = hit.url;
        console.log(query);
        console.log(hit);

        // Step 3: Redirect
        // window.location.href = redirectUrl;
        alert(`The query "${query}" redirected to ${redirectUrl}`);
      }
      return [];
    },
  }),
]);

search.start();
