/* global algoliasearch instantsearch */
import injectScript from 'scriptjs';

const searchClient = algoliasearch(
  '94IA10ZQ15',
  '81c06064842fb5879c0e4526377f44b1'
);
const search = instantsearch({
  indexName: 'geosearch',
  searchClient,
});

const index = searchClient.initIndex('geosearch');
export default index;

injectScript(
  'https://maps.googleapis.com/maps/api/js?v=quarterly&key=AIzaSyBawL8VbstJDdU5397SUX7pEt9DslAwWgQ',
  () => {
    search.addWidgets([
      instantsearch.widgets.searchBox({
        container: '#searchbox',
        // queryHook(search, query) {
        //   index.search(query);
        // }
      }),
      instantsearch.widgets.geoSearch({
        container: '#maps',
        googleReference: window.google,
        mapOptions: {
          mapTypeId: window.google.maps.MapTypeId.SATELLITE,
        },
      }),
      instantsearch.widgets.configure({
        aroundLatLngViaIP: true,
        aroundRadius: 100,
      }),
      instantsearch.widgets.queryRuleCustomData({
        container: '#msg',
        templates: {
          default: `
                {{#items}}
                  <p>{{msg}}</p>
                {{/items}}
              `,
        },
      }),
      instantsearch.widgets.hits({
        container: '#hits',
        templates: {
          item: `
          <div>
          <p><b>{{#helpers.highlight}}{ "attribute": "name" }{{/helpers.highlight}}</b></p>
          <p>Recommendation Score: {{ recScore }}</p>
          <p>Lat: {{ _geoloc.lat }}</p>
          <p>Long: {{_geoloc.lng }}</p>
        </div>
        `,
        },
      }),
    ]);

    search.start();
  }
);
