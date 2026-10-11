/* global instantsearch algoliasearch */

const search = instantsearch({
  indexName: 'demo_ecommerce',
  searchClient: algoliasearch('B1G2GM9NG0', 'aadef574be1f9252bb48d4ea09b5cfe5'),
});

search.addWidget(
  instantsearch.widgets.searchBox({
    container: '#searchbox',
  })
);

search.addWidget(
  instantsearch.widgets.clearRefinements({
    container: '#clear-refinements',
  })
);

search.addWidget(
  instantsearch.widgets.currentRefinements({
    container: '#current-refinements',
  })
);

const CustomMultiAttributeRefinementList = ({ container }) => {
  let brandsValues,
    categoriesValues = [];

  let refineBrand,
    refineCategories = x => x;

  const HiddenBrandsWidget = instantsearch.connectors.connectRefinementList(
    ({ items, refine }) => {
      refineBrand = refine;
      brandsValues = items.map(item => ({ ...item, _attribute: 'brand' }));
    }
  )({ attribute: 'brand' });

  const HiddenCategoriesWidget = instantsearch.connectors.connectRefinementList(
    ({ items, refine }) => {
      refineCategories = refine;
      categoriesValues = items.map(item => ({
        ...item,
        _attribute: 'categories',
      }));
    }
  )({ attribute: 'categories' });

  const VisibleWidget = instantsearch.connectors.connectStats(
    (renderOptions, isFirstRender) => {
      const allValues = [].concat(brandsValues).concat(categoriesValues);
      const wrapper = document.querySelector(container);
      wrapper.innerHTML = `
      <ul>
        ${allValues
          .map(
            value => `
          <li data-attribute="${value._attribute}" data-value="${value.value}" >
            <strong>${value._attribute}:</strong> ${value.label}
          </li>
        `
          )
          .join('')}
      </ul>
    `;

      wrapper.querySelector('ul').addEventListener('click', event => {
        const target = event.target;
        if (target.matches('li')) {
          const attribute = target.getAttribute('data-attribute');
          const value = target.getAttribute('data-value');
          switch (attribute) {
            case 'brand':
              return refineBrand(value);
            case 'categories':
              return refineCategories(value);
            default:
              return;
          }
        }
      });
    }
  )();
  return [HiddenBrandsWidget, HiddenCategoriesWidget, VisibleWidget];
};

search.addWidgets(
  CustomMultiAttributeRefinementList({
    container: '#brand-list',
  })
);

search.addWidget(
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      item: `
        <div>
          <img src="{{image}}" align="left" alt="{{name}}" />
          <div class="hit-name">
            {{#helpers.highlight}}{ "attribute": "name" }{{/helpers.highlight}}
          </div>
          <div class="hit-description">
            {{#helpers.highlight}}{ "attribute": "description" }{{/helpers.highlight}}
          </div>
          <div class="hit-price">\${{price}}</div>
        </div>
      `,
    },
  })
);

search.addWidget(
  instantsearch.widgets.pagination({
    container: '#pagination',
  })
);

search.start();
