/* global instantsearch algoliasearch $script */

/*$script(
  'https://maps.googleapis.com/maps/api/js?v=weekly&key=AIzaSyBawL8VbstJDdU5397SUX7pEt9DslAwWgQ',
  () => {
    const searchClient = algoliasearch(
      'S7DP4QP5W8',
      'bffa79d26a9ef740f9a4ea1e031e7f4e'
    );

    const search = instantsearch({
      indexName: 'stage_cookcompression_distributors',
      searchClient,
    });

    search.addWidgets([
      instantsearch.widgets.places({
        container: '#searchbox',
        placesReference: window.places,
      }),
      instantsearch.widgets.geoSearch({
        container: '#maps',
        googleReference: window.google,
      }),
    ]);

    search.start();
  }
);
*/
$script(
  'https://maps.googleapis.com/maps/api/js?v=weekly&key=AIzaSyBawL8VbstJDdU5397SUX7pEt9DslAwWgQ',
  () => {
    const searchClient = algoliasearch(
      'S7DP4QP5W8',
      'bffa79d26a9ef740f9a4ea1e031e7f4e'
    );
    const search = instantsearch({
      indexName: 'stage_cookcompression_distributors',
      searchClient,
    });
    search.addWidgets([
      instantsearch.widgets.places({
        container: '#searchbox',
        placesReference: window.places,
      }),
      instantsearch.widgets.geoSearch({
        container: '#maps',
        googleReference: window.google,
        enableRefineControl: true,
        enableRefineOnMapMove: true,
        transformItems(items) {
          return items
            .filter((item) => {
              return item._geoloc.lat != 0 && item._geoloc.lng != 0;
            })
            .map((item) => {
              return {
                ...item,
                _geoloc: {
                  lat: parseInt(item._geoloc.lat, 10),
                  lng: parseInt(item._geoloc.lng, 10),
                },
              };
            });
        },
      }),
    ]);
    search.start();
  }
);
