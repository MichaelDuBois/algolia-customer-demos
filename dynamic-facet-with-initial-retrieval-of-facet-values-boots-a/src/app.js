/* global algoliasearch instantsearch */

const algoliaConfig = {
  appID: 'latency',
  apiKey: '6be0576ff61c053d5f9a3225e2a90f76',
  indexName: 'instant_search',
};

const client = algoliasearch(algoliaConfig.appID, algoliaConfig.apiKey);

const search = instantsearch({
  indexName: algoliaConfig.indexName,
  searchClient: client,
});

// Retrieve the list of all facets from the index
const getProductAttributesFacets = () => {
  const index = client.initIndex('instant_search');
  return index.search({ facets: '*' }).then((results) => {
    return Object.keys(results.facets);
  });
};

// Retrieve all facets then run search
getProductAttributesFacets().then(runSearch);

function runSearch(facets) {
  // customize the search client
  const searchClient = {
    search(requests) {
      // search for all facets
      requests[0].params.facets = '*';
      return client.search(requests);
    },
    // search for the facet values
    searchForFacetValues(requests) {
      return client.searchForFacetValues(requests);
    },
    ...client,
  };

  const search = instantsearch({
    // algolia index to use
    indexName: algoliaConfig.indexName,
    // use the customized search client
    searchClient,
  });

  // ADD DEFAULT WIDGETS
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
    }),
    instantsearch.widgets.pagination({
      container: '#pagination',
    }),
  ]);

  search.on('render', () => {
    const [result] = search.helper.lastResults._rawResults;
    updateDynamicFacets(result.facets);
  });

  // util function to dynamically create a widget
  const createWidget = (facetKey) => {
    // const containerName = facetKey.split('.')[1].replace(/\s/g, '');
    const containerName = facetKey.split('.')[1];
    if (document.querySelector(`#${containerName}`)) {
      return instantsearch.widgets.refinementList({
        container: `#${containerName}`,
        attribute: facetKey,
        templates: {
          item: `
          <label class="ais-RefinementList-label">
            <input type="checkbox" class="ais-RefinementList-checkbox" value="{{label}}" {{#isRefined}}checked{{/isRefined}}>
            <span class="ais-RefinementList-labelText">{{shortLabel}} ({{count}})</span>
          </label>
      `,
        },
        transformItems(items) {
          return items.map((item) => ({
            ...item,
            shortLabel: item.label.split('>').slice(-1),
          }));
        },
      });
    }
  };

  // create the dynamic faceting widgets (optional filter panels)
  facets.forEach((facet) => {
    const item = facet.split('.');
    // consider facets in the hierarchicalCategories.lvl0/1/2/3/4 only
    // if (item[0] === 'hierarchicalCategories') {
    // const itemId = item[1].replace(/\s/g, '');
    const itemId = item[1];
    // create container element
    if (!document.getElementById(itemId)) {
      let lineBreak = document.createElement('br');
      let itemContainer = document.createElement('div');
      itemContainer.id = itemId;
      document.querySelector('#dynamic-facets').appendChild(lineBreak);
      document.querySelector('#dynamic-facets').appendChild(itemContainer);
      const widget = createWidget(facet);
      search.addWidget(widget);
    }
    // }
  });

  // hide or show the optional filter panels
  const updateDynamicFacets = (nextFacets) => {
    facets.forEach((facet) => {
      const item = facet.split('.');
      console.log(item);
      // if (item[0] === 'hierarchicalCategories') {
      // const itemId = item[1].replace(/\s/g, '');
      const itemId = item[1];
      const domElement = document.getElementById(itemId);
      if (domElement) {
        if (facet in nextFacets) {
          domElement.style.display = 'block';
        } else {
          domElement.style.display = 'none';
        }
        // }
      }
    });
  };

  // When fully loaded, run the search
  search.start();
}
