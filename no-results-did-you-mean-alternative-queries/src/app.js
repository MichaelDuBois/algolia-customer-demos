/* global instantsearch algoliasearch */

import searchRouting from './search-routing';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

const categoryMenu = instantsearch.widgets.panel({
  templates: {
    header: 'Category',
  },
})(instantsearch.widgets.menu);

const brandList = instantsearch.widgets.panel({
  templates: {
    header: 'Brands',
  },
})(instantsearch.widgets.refinementList);

const search = instantsearch({
  indexName: 'instant_search',
  searchClient,
  routing: searchRouting,
});

const extractHighlight = (highlight) => {
  if (highlight.match(/(<mark>.*?<\/mark>[^ ]*)/g))
    return [
      ...new Set(
        highlight
          .match(/(<mark>.*?<\/mark>[a-zA-Z0-9]*)/g)
          .map((val) => val.replace(/<\/?mark>/g, '').toLowerCase())
      ),
    ].join(' ');
  else return '';
};

const getQuerySuggestion = (hit) => {
  // get the suggestion based on hit
  let best_match = { matchLevel: 'none', value: '' };
  let reference = hit._highlightResult;
  let result = [];

  // find the best values
  for (let prop in reference) {
    switch (reference[prop].matchLevel) {
      case 'full':
        if (best_match.matchLevel === 'full') result.push(best_match.value);
        best_match.matchLevel = reference[prop].matchLevel;
        best_match.value = extractHighlight(reference[prop].value);
        break;
      case 'partial':
        if (best_match.matchLevel !== 'full') {
          best_match.matchLevel = reference[prop].matchLevel;
          best_match.value = extractHighlight(reference[prop].value);
        }
        break;
      default:
        break;
    }
  }
  return [...result, best_match.value];
};

const renderHits = (renderOptions, isFirstRender) => {
  const { hits, widgetParams } = renderOptions;
  if (hits && hits[0] && hits[0]._rankingInfo.nbTypos > 0) {
    let suggestions = [];
    //Use all hits for suggestions
    for (let i in hits) suggestions.push(...getQuerySuggestion(hits[i]));

    //remove duplicates
    suggestions = [...new Set(suggestions)];
    suggestions = suggestions.filter((n) => n);

    // Change the page to display the suggestion
    document.querySelector(widgetParams.container).innerHTML = `<p>
    Oh no! We didn't find any results, ${
      suggestions.length > 1
        ? 'did you mean any of those queries?'
        : 'did you mean'
    }</p>
    <ul class="suggestions">
      ${suggestions
        .map(
          (elt) =>
            `<li class="suggestion">
            <a href="/search/?query=${elt.replace(' ', '%2520')}">${elt}</a>
            </li>`
        )
        .join('')}
    </ul>`;
  } else if (hits && hits[0]) {
    //Otherwise display results
    document.querySelector(widgetParams.container).innerHTML = `  
      ${hits
        .map(
          (item) =>
            `<li class="ais-Hits-item"><div>${instantsearch.highlight({
              attribute: 'name',
              hit: item,
            })}</div></li>`
        )
        .join('')}
  `;
  } else {
    document.querySelector(widgetParams.container).innerHTML = `<p>
      display here some no results
    </p>`;
  }
};

// 2. Create the custom widget
const customDidYouMeanHits = instantsearch.connectors.connectHits(renderHits);

search.addWidgets([
  instantsearch.widgets.configure({
    getRankingInfo: true,
  }),
  instantsearch.widgets.searchBox({
    container: '#searchbox',
  }),
  instantsearch.widgets.clearRefinements({
    container: '#clear-refinements',
  }),
  customDidYouMeanHits({
    container: '#hits',
  }),
  categoryMenu({
    container: '#menu',
    attribute: 'categories',
  }),
  brandList({
    container: '#refinement-list',
    attribute: 'brand',
  }),
  instantsearch.widgets.pagination({
    container: '#pagination',
  }),
]);

search.start();
