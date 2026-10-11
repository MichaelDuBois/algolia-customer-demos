/* global instantsearch algoliasearch */

const search = instantsearch({
  indexName: 'ecommerce',
  searchClient: algoliasearch('94IA10ZQ15', '81c06064842fb5879c0e4526377f44b1'),
});

search.addWidgets([
  instantsearch.widgets.searchBox({
    container: '#searchbox',
  }),
  instantsearch.widgets.clearRefinements({
    container: '#clear-refinements',
  }),
  instantsearch.widgets.refinementList({
    container: '#brand-list',
    attribute: 'brand',
  }),
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      item: (hit, bindEvent) => `
        <div>
          <img src="${hit.image}" align="left" alt="${hit.name}" />
          <div class="hit-name">
            ${hit.name}
          </div>
          <div>
           <button ${bindEvent('click', hit, 'my-click-event')}>
             Click event
           </button>
           <button ${bindEvent('conversion', hit, 'my-conversion-event')}>
             Conversion event
           </button>
          </div>
        </div>
      `,
    },
  }),
  instantsearch.widgets.pagination({
    container: '#pagination',
  }),
]);

search.use(
  instantsearch.middlewares.createInsightsMiddleware({
    insightsClient: window.aa,
    onEvent: (event, aa) => {
      const { insightsMethod, payload } = event;

      if (
        insightsMethod === 'viewedObjectIDs' &&
        payload.objectIDs.length > 20
      ) {
        var arrays = [],
          size = 20;
        var a = payload.objectIDs;

        for (let i = 0; i < a.length; i += size)
          arrays.push(a.slice(i, i + size));

        arrays.forEach((item) => {
          var newPayload = { ...payload, objectIDs: item };
          aa(insightsMethod, newPayload);
        });
      } else {
        aa(insightsMethod, payload);
      }
    },
  })
);

window.aa('setUserToken', 'my-user-token');

search.start();
