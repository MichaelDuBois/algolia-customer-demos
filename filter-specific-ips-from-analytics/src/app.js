/* globals algoliasearch, instantsearch */

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

const search = instantsearch({
  indexName: 'instant_search',
  searchClient,
});

const LOCAL_IP_ADDRESSES = [
  '172.188.27.235',
  '86.185.146.102',
  '168.152.128.165',
  '18.28.89.216',
  '69.102.129.255',
];

// TODO: capture the current IP address
const currentIp = '172.188.27.235';

search.addWidgets([
  instantsearch.widgets.configure({
    analytics: !LOCAL_IP_ADDRESSES.includes(currentIp),
  }),
  instantsearch.widgets.searchBox({
    container: '#searchbox',
  }),
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      item: `
        <article>
          <h3>{{#helpers.highlight}}{ "attribute": "name" }{{/helpers.highlight}}</h3>
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

search.start();
