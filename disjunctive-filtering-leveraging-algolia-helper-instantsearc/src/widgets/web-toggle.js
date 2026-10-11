const webToggle = (widgetParams) => {
  const { attribute, container, menuAttribute, menuContainer } = widgetParams;

  const root = document.querySelector(container);
  root.innerHTML = `
    <label class="ais-RefinementList-label">
      <input type="checkbox" class="ais-RefinementList-checkbox">
      <span class="ais-RefinementList-labelText">${attribute}</span>
    </label>
  `;

  const checkbox = root.querySelector('input');

  return {
    $$type: 'ais.web-toggle',
    init(initOptions) {
      const { helper } = initOptions;

      // Add filter event listener to the checkbox
      checkbox.addEventListener('change', () => {
        const filters = [];

        const select = document.querySelector(`${menuContainer} select`);
        if (select.value) filters.push(`${menuAttribute}:${select.value}`);

        if (checkbox.checked) filters.push(`${attribute}:true`);

        helper.setQueryParameter('filters', filters.join(' OR ')).search();
      });
    },
    render() {},
    dispose() {
      root.innerHTML = '';
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
    getWidgetRenderState() {},
  };
};

export default webToggle;
