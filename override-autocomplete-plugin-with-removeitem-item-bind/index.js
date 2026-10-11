/* global algoliasearch autocomplete getAlgoliaFacets createLocalStorageRecentSearchesPlugin createQuerySuggestionsPlugin getAlgoliaResults */

// Instantiate the Algolia search client
const appId = "latency";
const apiKey = "6be0576ff61c053d5f9a3225e2a90f76";
const searchClient = algoliasearch(appId, apiKey);

// Create recent search plugin
const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
  key: "navbar", // your cookie name
  limit: 3,
  transformSource({ source, onRemove }) {
    return {
      ...source,
      templates: {
        ...source.templates,
        item(params) {
          const { item, html, components } = params;

          return html`<div class="aa-ItemWrapper">
            <div class="aa-ItemContent">
              <div class="aa-ItemIcon aa-ItemIcon--noBorder">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M12.516 6.984v5.25l4.5 2.672-0.75 1.266-5.25-3.188v-6h1.5zM12 20.016q3.281 0 5.648-2.367t2.367-5.648-2.367-5.648-5.648-2.367-5.648 2.367-2.367 5.648 2.367 5.648 5.648 2.367zM12 2.016q4.125 0 7.055 2.93t2.93 7.055-2.93 7.055-7.055 2.93-7.055-2.93-2.93-7.055 2.93-7.055 7.055-2.93z"
                  ></path>
                </svg>
              </div>
              <div class="aa-ItemContentBody">
                <div class="aa-ItemContentTitle">
                  ${components.ReverseHighlight({
                    hit: item,
                    attribute: "label"
                  })}
                </div>
              </div>
            </div>
            <div class="aa-ItemActions">
              <button
                className="aa-ItemActionButton"
                title="Remove this search"
                onClick="${(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onRemove(item.id);
                }}"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M18 7v13c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-10c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-13zM17 5v-1c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879h-4c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v1h-4c-0.552 0-1 0.448-1 1s0.448 1 1 1h1v13c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h10c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-13h1c0.552 0 1-0.448 1-1s-0.448-1-1-1zM9 5v-1c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293h4c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v1zM9 11v6c0 0.552 0.448 1 1 1s1-0.448 1-1v-6c0-0.552-0.448-1-1-1s-1 0.448-1 1zM13 11v6c0 0.552 0.448 1 1 1s1-0.448 1-1v-6c0-0.552-0.448-1-1-1s-1 0.448-1 1z"
                  />
                </svg>
              </button>
            </div>
          </div>`;
        }
      }
    };
  }
});

// Create the Query Suggestions plugin
const querySuggestionsPlugin = createQuerySuggestionsPlugin({
  searchClient,
  indexName: "query_suggestions",
  getSearchParams() {
    return { hitsPerPage: 4 };
  },
  transformSource({ source }) {
    return {
      ...source,
      getItemUrl({ item }) {
        return "/search?q=" + item.query; // your search URL for keyboard navigation
      },
      templates: {
        ...source.templates,
        header({ html }) {
          return html`
            <span className="aa-SourceHeaderTitle">Sugguestion</span>
            <div className="aa-SourceHeaderLine" />
          `;
        },
        item(params) {
          const { item, html } = params;
          return html`<a className="aa-ItemLink" href="/search?q=${item.query}">
            ${source.templates.item(params).props.children}
          </a>`;
        }
      }
    };
  }
});

autocomplete({
  container: "#autocomplete", //Define where your search box goes in the DOM
  placeholder: "Search for everything", //Define placeholder text
  openOnFocus: true, //If true, dropdown appears as soon as users focuses the input to display trending searches
  debug: true, //If true, keeps the panel open when inspecting elements in your browser
  plugins: [querySuggestionsPlugin, recentSearchesPlugin], //Add the Query Suggestions plugin
  onSubmit({ state }) {
    window.location.replace("/search?q=" + state.query); // keyboard enter
  },
  getSources({ query, state }) {
    return [
      {
        sourceId: "products",
        getItems() {
          return getAlgoliaResults({
            searchClient,
            queries: [
              {
                indexName: "instant_search",
                query,
                params: {
                  hitsPerPage: 5
                }
              }
            ]
          });
        },
        getItemUrl({ item }) {
          return "/search?q=" + item.url; // your search URL for keyboard navigation
        },
        templates: {
          header({ html }) {
            return html` <span className="aa-SourceHeaderTitle">Products</span>
              <div className="aa-SourceHeaderLine" />`;
          },
          item({ item, components, html }) {
            return ProductItem(item, components, html);
          },
          noResults() {
            return "No products for this query.";
          }
        }
      }
    ];
  },
  render({ elements, render, html }, root) {
    const { recentSearchesPlugin, querySuggestionsPlugin, products } = elements;

    render(
      html`<div className="aa-PanelLayout aa-Panel--scrollable">
        <div className="aa-PanelSections">
          <div className="aa-PanelSection aa-PanelSection--left">
            ${querySuggestionsPlugin} ${recentSearchesPlugin}
          </div>
          <div className="aa-PanelSection aa-PanelSection--right">
            ${products}
          </div>
        </div>
      </div>`,
      root
    );
  }
});

// Add template for Product items
function ProductItem(hit, components, html) {
  return html` <a href="${hit.Product_URL}" className="aa-ItemLink">
    <div className="aa-ItemContent">
      <div className="aa-ItemIcon aa-ItemIcon--picture aa-ItemIcon--alignTop">
        <img src="${hit.image}" alt="${hit.name}" width="40" height="40" />
      </div>
      <div className="aa-ItemContentBody">
        <div className="aa-ItemContentTitle">
          ${components.Highlight({ hit: hit, attribute: "name" })}
        </div>
      </div>
    </div>
  </a>`;
}
