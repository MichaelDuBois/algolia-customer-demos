import {
  autocomplete,
  getAlgoliaResults,
  reverseHighlightItem
} from "@algolia/autocomplete-js";
import algoliasearch from "algoliasearch/lite";
import instantsearch from "instantsearch.js";
import { connectSearchBox } from "instantsearch.js/es/connectors";
import { hits } from "instantsearch.js/es/widgets";

const searchClient = algoliasearch(
  "latency",
  "6be0576ff61c053d5f9a3225e2a90f76"
);

const autocompleteSearchBox = connectSearchBox((props, isFirstRender) => {
  if (!isFirstRender) {
    return;
  }

  autocomplete({
    container: props.widgetParams.container,
    showCompletion: true,
    openOnFocus: true,
    initialState: {
      query: props.query
    },
    onSubmit({ state }) {
      props.refine(state.query);
    },
    getSources({ query }) {
      return getAlgoliaResults({
        searchClient,
        queries: [
          {
            indexName: "instant_search_demo_query_suggestions",
            query,
            params: {
              hitsPerPage: 5
            }
          }
        ]
      }).then(([suggestions]) => {
        return [
          {
            getInputValue({ suggestion }) {
              return suggestion.query;
            },
            getSuggestions() {
              return suggestions.hits;
            },
            onSelect({ suggestion }) {
              props.refine(suggestion.query);
            },
            templates: {
              item({ item }) {
                const [
                  category
                ] = item.instant_search.facets.exact_matches.categories;

                return `
                    <div class="autocomplete-item">
                      <svg viewBox="0 0 18 18" width="16" height="16">
                        <path d="M13.14 13.14L17 17l-3.86-3.86A7.11 7.11 0 1 1 3.08 3.08a7.11 7.11 0 0 1 10.06 10.06z" stroke="currentColor" stroke-width="1.78" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path>
                      </svg>
  
                      <div class="autocomplete-item-content">
                        <span>${reverseHighlightItem({
                          item,
                          attribute: "query"
                        })}</span>

                        <div class="item-info">
                          in <span class="item-category">${
                            category.value
                          }</span>
                        </div>
                      </div>
                    </div>
                  `;
              }
            }
          }
        ];
      });
    }
  });
});

const search = instantsearch({
  searchClient,
  indexName: "instant_search",
  routing: true
});

search.addWidgets([
  autocompleteSearchBox({
    container: "#autocomplete"
  }),
  hits({
    container: "#hits",
    templates: {
      item: `
        <article>
          <h1>{{#helpers.highlight}}{ "attribute": "name" }{{/helpers.highlight}}</h1>
          <p>{{#helpers.highlight}}{ "attribute": "description" }{{/helpers.highlight}}</p>
        </article>
      `
    }
  })
]);

search.start();
