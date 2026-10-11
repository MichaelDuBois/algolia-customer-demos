// Instructions
// 1. Update searchClient for your App ID and Search API Key
// 2. Open Segment account at Segment.io
// 3. Follow Instructions for Algolia Segment connector:
// https://www.algolia.com/doc/guides/getting-insights-and-analytics/connectors/segment/

/* global algoliasearch instantsearch */

// Setting the userToken
let userToken;
window.aa('getUserToken', null, (err, newUserToken) => {
  if (err) {
    console.error(err);
    return;
  }
  userToken = newUserToken;
});
window.aa('setUserToken', userToken);
console.log(userToken);
const searchClient = algoliasearch(
  'SYZEVV63H0',
  '2ec98187854a21f4062c841a80f62dc2'
);

const search = instantsearch({
  indexName: 'instant_search',
  searchClient,
});

// Create insights middleware
const insightsMiddleware = instantsearch.middlewares.createInsightsMiddleware({
  insightsClient: window.aa,
  onEvent(event) {
    const { payload } = event;
    console.log(payload);
    if (payload.eventName === 'Hits Viewed') {
      window.analytics.track('Product List Viewed', {
        products: payload.objectIDs.map((objectID) => ({
          objectID,
        })),
        index: payload.index,
      });
      console.log('Tracked Product List Viewed');
    }
    if (payload.eventName === 'Product Clicked') {
      window.analytics.track('Product Clicked', {
        objectID: payload.objectIDs[0],
        position: payload.positions[0],
        index: payload.index,
        queryID: payload.queryID,
        userToken,
      });
      console.log('Tracked Product Clicked');
    }
    // Track conversion event
    if (payload.eventName === 'Product Added') {
      window.analytics.track('Product Added', {
        objectID: payload.objectIDs[0],
        index: payload.index,
        queryID: payload.queryID,
        userToken,
      });
      console.log('Tracked Product Added');
    }
  },
});

// Connecting InstantSearch with the insights middleware
// search.use(insightsMiddleware);

search.addWidgets([
  instantsearch.widgets.configure({
    // return queryID in response
    clickAnalytics: true,
  }),
  instantsearch.widgets.searchBox({
    container: '#searchbox',
  }),
  instantsearch.widgets.hits({
    container: '#hits',
    // Button will send a click or conversion event
    templates: {
      item(hit, bindEvent) {
        return `
        <article 
          >
          <h1>${instantsearch.highlight({ attribute: 'name', hit })}</h1>
          <button
            type="button"
            ${bindEvent('click', hit, 'Product Clicked')}
          >
            View product
          </button>
          <br />
          <button
            type="button"
            ${bindEvent('conversion', hit, 'Product Added')}
          >
            Add to cart
          </button>
        </article>
        `;
      },
    },
  }),
  instantsearch.widgets.refinementList({
    container: '#brand-list',
    attribute: 'brand',
  }),
  instantsearch.widgets.pagination({
    container: '#pagination',
  }),
]);

search.start();
