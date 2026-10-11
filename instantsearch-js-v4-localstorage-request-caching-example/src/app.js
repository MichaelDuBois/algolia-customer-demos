import { createBrowserLocalStorageCache } from '@algolia/cache-browser-local-storage';

const { algoliasearch, instantsearch } = window;

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76',

  // -- Temporary caching of requests in LocalStorage
  // -- allowing to prevent a new search request from being sent
  // -- when the end user returns to the listing page after
  // -- visiting one or more on one or more product detail
  // -- pages for the given result sets
  // --
  // Learn more: https://www.algolia.com/doc/api-client/getting-started/customize/javascript/?client=javascript#caching-the-state-of-hosts
  // Important: Best to keep the value to a few minutes max.
  //
  {
    // Caches responses
    responsesCache: createBrowserLocalStorageCache({
      key: `responses-cache`,
      timeToLive: 3 * 60, // 3 minutes
    }),

    // Caches Promises with the same request payload
    requestsCache: createBrowserLocalStorageCache({
      key: `requests-cache`,
      timeToLive: 3 * 60, // 3 minutes
    }),
  }
);

const search = instantsearch({
  indexName: 'instant_search',
  searchClient,
  future: { preserveSharedStateOnUnmount: true },
});

search.addWidgets([
  instantsearch.widgets.searchBox({
    container: '#searchbox',
  }),
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      item: (hit, { html, components }) => html`
        <article>
          <a href="${hit.url}"
            ><h1>${components.Highlight({ hit, attribute: 'name' })}</h1></a
          >
          <p>${components.Highlight({ hit, attribute: 'description' })}</p>
        </article>
      `,
    },
  }),
  instantsearch.widgets.configure({
    hitsPerPage: 8,
  }),
  instantsearch.widgets.panel({
    templates: { header: () => 'brand' },
  })(instantsearch.widgets.refinementList)({
    container: '#brand-list',
    attribute: 'brand',
  }),
  instantsearch.widgets.pagination({
    container: '#pagination',
  }),
]);

search.start();
