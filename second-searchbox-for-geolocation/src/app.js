import algoliasearch from 'algoliasearch/lite';
import instantsearch from 'instantsearch.js';
import { connectConfigure } from 'instantsearch.js/es/connectors';
import {
  searchBox,
  hits,
  refinementList,
  pagination,
} from 'instantsearch.js/es/widgets';

const searchClient = algoliasearch(
  'OUR12RLLSJ',
  '4b43b60a9edeba75df1a41e1b8a5e623'
);

// 1. Create a render function
//This rendering function is called before the first
//search (init lifecycle step) and each time results
//come back from Algolia (render lifecycle step).
const renderConfigure = (renderOptions, isFirstRender) => {
  const { refine } = renderOptions;
  console.log(isFirstRender);
  //reblace 'products'
  console.log(
    renderOptions.instantSearchInstance.renderState.products.refinementList
  );
  if (isFirstRender) {
    const input = document.createElement('input');

    input.addEventListener('input', () => {
      //TODO: inject logic to read input from 'input' element
      //convert to lat/long, then set it for aroundLatLng
      refine({ aroundLatLng: '45.0,93.0' });
    });

    var x = { test: 'hello' };
    //append custom widget ui to actual page
    document.querySelector('#configure').appendChild(input);
  }
};

// 2. Create the custom widget
const customConfigure = connectConfigure(renderConfigure);

const search = instantsearch({
  indexName: 'products',
  searchClient,
  //README: this is another way to access state via helper within instantsearch
  //searchFunction(helper) {
  //    helper
  //      .setQueryParameter('aroundLatLng', '')
  //      .setQueryParameter('aroundRadius', '10000000')
  //      .search();
  //  }
});

search.addWidgets([
  customConfigure({
    searchParameters: {},
  }),
  searchBox({
    container: '#searchbox',
  }),
  hits({
    container: '#hits',
    templates: {
      item: `
<article>
  <h1>{{#helpers.highlight}}{ "attribute": "name" }{{/helpers.highlight}}</h1>
  <p>{{#helpers.highlight}}{ "attribute": "description" }{{/helpers.highlight}}</p>
  <p>Made by: {{ brand }}</p>
</article>
`,
    },
  }),
  refinementList({
    container: '#brand-list',
    attribute: 'brand',
  }),
  pagination({
    container: '#pagination',
  }),
]);

search.start();
