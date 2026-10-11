const connectLocationMenu = (renderFn, disposeFn, params) => {
  const { attribute, select, toggleAttribute, toggleContainer } = params;
  let isFirstRender = true;

  return {
    $$type: 'ais.location-menu',
    init(initOptions) {
      const { helper } = initOptions;

      select.addEventListener('change', (event) => {
        const { value } = event.target;
        const filters = [];

        const checkbox = document.querySelector(`${toggleContainer} input`);

        if (checkbox.checked) filters.push(`${toggleAttribute}:true`);

        if (value) {
          filters.push(`${attribute}:'${value}'`);

          if (!checkbox.checked) {
            checkbox.checked = true;
            filters.push(`${toggleAttribute}:true`);
          }
        }

        helper.setQueryParameter('filters', filters.join(' OR ')).search();
      });

      renderFn(this.getWidgetRenderState(initOptions), true);
    },
    render(renderOptions) {
      renderFn(this.getWidgetRenderState(renderOptions), false);
    },
    dispose() {
      disposeFn();
    },
    getWidgetUiState(uiState) {
      return uiState;
    },
    getWidgetSearchParameters(searchParameters) {
      return searchParameters;
    },
    getRenderState(renderState) {
      return renderState;
    },
    getWidgetRenderState({ results, ...rest }) {
      if (!results) return;

      const facet = results.facets.find((facet) => facet.name === attribute);
      if (!facet) return;

      if (!isFirstRender) return;
      isFirstRender = false;

      const facetValues = Object.keys(facet.data);

      select.innerHTML = `
        <option class="ais-MenuSelect-option" value="">See all</option>
        ${facetValues
          .sort()
          .map(
            (value) =>
              `<option 
                class="ais-MenuSelect-option" 
                value="${value}"
                ${value === select.value ? 'selected' : ''}
              >
                ${value}
              </option>`
          )
          .join('')}
      `;
    },
  };
};

export default (widgetParams) => {
  const {
    attribute,
    container,
    toggleAttribute,
    toggleContainer,
  } = widgetParams;

  const root = document.querySelector(container);

  root.innerHTML = `
    <div class="ais-MenuSelect">
      <select class="ais-MenuSelect-select"></select>
    </div>
  `;

  const render = () => {};

  const dispose = () => {
    root.innerHTML = '';
  };

  const connectorParams = {
    attribute,
    select: root.querySelector('select'),
    toggleAttribute,
    toggleContainer,
  };

  return {
    ...connectLocationMenu(render, dispose, connectorParams),
    $$widgetType: 'ais.location-menu',
  };
};
