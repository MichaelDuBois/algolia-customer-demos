/* global algoliasearch instantsearch */
const { connectRefinementList } = instantsearch.connectors;

const searchClient = algoliasearch(
  'OUR12RLLSJ',
  'ffc904c8dab7f0b0e75ec7f2110170c1'
);

// 1. Create a render function
const renderRefinementList = (renderOptions, isFirstRender) => {
  const { items, refine, createURL, widgetParams } = renderOptions;

  if (isFirstRender) {
    const ul = document.createElement('ul');
    widgetParams.container.appendChild(ul);
  }

  widgetParams.container.querySelector('ul').innerHTML = items
    .map(
      (item) => `
        <li
          style="${item.value === 'true' ? 'display:none' : ''}"
        >
          <a
            id="${item.value}"
            href="${createURL(item.value)}"
            data-value="${item.value}"
            style="font-weight: ${item.isRefined ? 'bold' : ''};"
          >
            ${item.label} (${item.count})
          </a>
        </li>
      `
    )
    .join('');

  [...widgetParams.container.querySelectorAll('a')].forEach((element) => {
    element.addEventListener('click', (event) => {
      event.preventDefault();
      refine(event.currentTarget.dataset.value);
    });
  });
};

// 2. Create the custom widget
const customRefinementList = connectRefinementList(renderRefinementList);

const search = instantsearch({
  indexName: 'products',
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
  <h1>{{#helpers.highlight}}{ "attribute": "name" }{{/helpers.highlight}}</h1>
  <p>{{#helpers.highlight}}{ "attribute": "description" }{{/helpers.highlight}}</p>
</article>
`,
    },
  }),
  // 3. Instantiate Custom Widget
  customRefinementList({
    container: document.querySelector('#free-shipping-custom'),
    attribute: 'free_shipping',
    showMoreLimit: 2,
  }),
  instantsearch.widgets.stats({
    container: '#stats',
  }),
  /*instantsearch.widgets.refinementList({
    container: '#brand-list',
    attribute: 'brand',
  }),*/
  instantsearch.widgets.pagination({
    container: '#pagination',
  }),
  // Needs to be after the refinement list
  instantsearch.widgets.configure({
    disjunctiveFacetsRefinements: {
      free_shipping: ['true'],
    },
  }),
]);

search.start();
