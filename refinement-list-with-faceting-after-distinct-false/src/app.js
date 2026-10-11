function facetingAfterDistinctWidget(options) {
  let secondQueryHelper;

  function _setFacetOnMainQueryCall(helper) {
    let helperState = helper.getState();
    helperState = helperState.addDisjunctiveFacet(options.attributeName);
    helper.setState(helperState);
  }

  function _setSecondQueryCallWithDistinctFalse(helper) {
    secondQueryHelper = helper.derive((searchParameters) => {
      let updatedSearchParams = searchParameters.setQueryParameter(
        'facetingAfterDistinct',
        false
      );

      updatedSearchParams = updatedSearchParams.addDisjunctiveFacet(
        options.attributeName
      );

      updatedSearchParams = updatedSearchParams.setQueryParameter(
        'maxValuesPerFacet',
        options.limit
      );

      return updatedSearchParams;
    });
  }

  function _render(helper) {
    const container = document.querySelector(options.container);

    secondQueryHelper.on('result', (result) => {
      const facetData = result.disjunctiveFacets.find(
        (facet) => options.attributeName === facet.name
      );
      const widgetData = facetData ? facetData.data : {};

      if (widgetData) {
        const facetValues = Object.keys(widgetData);
        const refinements = helper.getState().disjunctiveFacetsRefinements[
          options.attributeName
        ];

        // Render Facet Response
        container.innerHTML = facetValues
          .map(
            (facetValue) => `
            <a 
              href="" 
              class="facet-link ${
                refinements && refinements.indexOf(facetValue) >= 0
                  ? `facet-link-active`
                  : ``
              }"
              data-facet-value="${facetValue}"
            >
              ${facetValue} (${widgetData[facetValue]})
            </a>
          `
          )
          .join(',');

        _addEventListeners(helper);
      }
    });
  }

  function _addEventListeners(helper) {
    Array.prototype.forEach.call(
      document.getElementsByClassName('facet-link'),
      (link) => {
        link.addEventListener('click', (event) => {
          event.preventDefault();
          helper.toggleFacetRefinement(
            options.attributeName,
            event.currentTarget.dataset.facetValue
          );

          helper.search();
        });
      }
    );
  }

  return {
    init({ helper }) {
      _setFacetOnMainQueryCall(helper);
      _setSecondQueryCallWithDistinctFalse(helper);
      _render(helper);
    },
  };
}

/* global instantsearch */

const search = instantsearch({
  appId: 'VYLEWMPKEZ',
  apiKey: '8940a18fde155adf3f74b0912c267aa4',
  indexName: 'shoes',
  searchParameters: {
    facetingAfterDistinct: true,
  },
});

search.addWidget(
  instantsearch.widgets.searchBox({
    container: '#searchbox',
    autofocus: false,
  })
);

search.addWidget(
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      item: `
        <article>
          <h1>{{{title}}}</h1>
          <p>{{{colour}}}</p>
          <p>{{{brand}}}</p>
          <p>{{{objectID}}}</p>
        </article>
      `,
    },
  })
);

search.addWidget(
  facetingAfterDistinctWidget({
    container: '#brand-list-2',
    attributeName: 'colour',
    limit: 20,
  })
);

search.addWidget(
  instantsearch.widgets.refinementList({
    container: '#brand-list',
    attributeName: 'brand',
    limit: 20,
  })
);

search.addWidget(
  instantsearch.widgets.pagination({
    container: '#pagination',
  })
);

search.start();
