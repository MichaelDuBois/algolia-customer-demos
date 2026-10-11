/* global instantsearch algoliasearch */

//1. This represents config.searchClient on lines ~430 of source code
const searchClientController = algoliasearch(
  //controller backend
  '0PMZPWMCIU',
  '9c259c59ae5d0d2bf240c4e6f68d790b'
);

//2. proxy would take the config.searchClient as an object and be added before "var search = instantsearch({" on lines 430 of source code
// this would REPLACE the config.searchClient in the instantsearch initialization. New value = searchClient
const searchClient = {
  ...searchClientController,
  search(requests) {
    // enable to see the requests coming from the widgets
    //console.log(requests);

    //3. Below is a variable that contains the response of both searches (main and sponsered search).
    const res = searchClientController.search(requests);
    //4. read the second request and inject it into the 4th spot and/or wherever it needs to go in the initial results
    //Code would be similar to what is on line ~ 2534 of source code

    console.log('res');
    console.log(res);
    // use this to return the results to instantSearch
    return res;
  },
};

var sponsoredProductsArray = [];

function middleware({ instantSearchInstance }) {
  return {
    onStateChange({ uiState }) {},
    subscribe() {
      //acquire sponsored item and add to array. this is similar to lines ~628 of source code
      sponsoredProductsArray[0] = `variantGroupCode: ${123456}<score=${10000}>`;
      console.log(sponsoredProductsArray);
      console.log('sponsored');
    },
    unsubscribe() {},
  };
}

const search = instantsearch({
  indexName: 'mergeTest',
  searchClient,
});

search.addWidgets([
  instantsearch.widgets.configure({
    hitsPerPage: 8,
    clickAnalytics: true,
  }),
  instantsearch.widgets.searchBox({
    container: '#searchbox',
  }),
  instantsearch.widgets.hits({
    container: '#hits-instant-search',
    templates: {
      item:
        '{{#helpers.highlight}}{ "attribute": "name" }{{/helpers.highlight}}',
    },
    transformItems: function (items, { results }) {
      console.log('results');
      console.log(results);
      //results from second instantsearch will be available here from proxy
      return items.map((item, index) => ({
        ...item,
      }));
    },
  }),
  instantsearch.widgets
    .index({ indexName: 'mergeTest', indexId: 'mergeTestSponser' })
    .addWidgets([
      instantsearch.widgets.configure({
        hitsPerPage: 1,
        facetFilters: sponsoredProductsArray, //we pass the parameter as a FACETFILTER to avoid rules and reranking.
        clickAnalytics: true,
      }),
      //This is here strictly to show the filtered result in the GUI
      instantsearch.widgets.hits({
        container: '#hits-instant-search-price-desc',
        templates: {
          item:
            '{{#helpers.highlight}}{ "attribute": "name" }{{/helpers.highlight}}',
        },
      }),
    ]),
]);

search.use(middleware);
search.start();
