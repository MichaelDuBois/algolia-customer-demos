/* global instantsearch algoliasearch */
import { connectRefinementList } from 'instantsearch.js/es/connectors';

const search = instantsearch({
  indexName: 'demo_ecommerce',
  searchClient: algoliasearch('B1G2GM9NG0', 'aadef574be1f9252bb48d4ea09b5cfe5'),
});

const renderRefinementList = (renderOptions, isFirstRender) => {
  console.log('renderOptions', renderOptions);
  const {
    items,
    refine,
    widgetParams,
    instantSearchInstance,
    toggleShowMore,
    canToggleShowMore,
    isShowingMore,
    isFromSearch,
    searchForItems,
  } = renderOptions;
  const { attribute, limit, showMore, searchable } = widgetParams;
  const container = document.querySelector(widgetParams.container);

  if (isFirstRender) {
    const ul = document.createElement('ul');

    if (searchable) {
      const input = document.createElement('input');

      input.addEventListener('input', (event) => {
        searchForItems(event.currentTarget.value);
      });

      container.appendChild(input);
    }

    container.appendChild(ul);

    if (showMore) {
      const button = document.createElement('button');
      button.addEventListener('click', () => {
        toggleShowMore();
      });
      container.appendChild(button);
    }
  } else {
    const input = container.querySelector('input');

    if (searchable && !isFromSearch && input.value) {
      input.value = '';
    }

    const defaultDisplayCount = limit ? limit : 10;
    const facets =
      instantSearchInstance.helper.lastResults._rawResults[0].facets;
    let totalFacets =
      Object.keys(facets[attribute]).length - defaultDisplayCount;
    let html = '';

    html = items
      .map(
        (item) => `
        <li>
          <a
            href="#"
            data-value="${item.value}"
            style="font-weight: ${item.isRefined ? 'bold' : ''}"
          >
            ${item.label} (${item.count})
          </a>
        </li>
      `
      )
      .join('');

    if (showMore) {
      const btnText = isShowingMore
        ? `Show top ${defaultDisplayCount} items`
        : `Show ${totalFacets} more`;

      const button = container.querySelector('button');
      if (!isFromSearch) {
        button.disabled = !canToggleShowMore;
        button.textContent = btnText;
        button.style.display = 'block';
      } else {
        button.style.display = 'none';
      }
    }

    container.querySelector('ul').innerHTML = html;

    [...container.querySelectorAll('a')].forEach((element) => {
      element.addEventListener('click', (event) => {
        event.preventDefault();
        refine(event.currentTarget.dataset.value);
      });
    });
  }
};

const customRefinementList = connectRefinementList(renderRefinementList);

search.addWidgets([
  instantsearch.widgets.searchBox({
    container: '#searchbox',
  }),
  instantsearch.widgets.clearRefinements({
    container: '#clear-refinements',
  }),
  customRefinementList({
    container: '#brand-list',
    attribute: 'brand',
    searchable: true,
    showMore: true,
    limit: 5,
    showMoreLimit: 50,
  }),
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
  }),
  instantsearch.widgets.pagination({
    container: '#pagination',
  }),
]);

search.start();
