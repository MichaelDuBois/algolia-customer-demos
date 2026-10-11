/* global instantsearch */

import { hitTemplate } from "./helpers";

const appId = "latency";
const apiKey = "af044fb0788d6bb15f807e4420592bc5";

const search = instantsearch({
  appId: appId,
  apiKey: apiKey,
  indexName: "instant_search",
  searchParameters: {
    hitsPerPage: 5,
    attributesToSnippet: ["description:24"],
    snippetEllipsisText: " [...]"
  }
});

// Uncomment the following widget to add hits list.

search.addWidget(
  instantsearch.widgets.hits({
    container: "#hits",
    templates: {
      //no results behavior
      empty: function (result) {
        const client = search.client;
        const index = client.initIndex("query_suggestions");
        index
          .search({
            hitsPerPage: 3
          })
          .then(({ hits }) => {
            const container = document.getElementById("hits");
            const hitsText = hits.map((h) => h.query).join(", ");
            container.innerText = `Popular search terms: ${hitsText}`;
          });
      },
      item: function (hit) {
        return hitTemplate(hit);
      }
    }
  })
);

// Uncomment the following widget to add a search bar.

search.addWidget(
  instantsearch.widgets.searchBox({
    container: "#searchbox",
    placeholder: "Search for products",
    autofocus: false
  })
);

// Uncomment the following widget to add search stats.

search.addWidget(
  instantsearch.widgets.stats({
    container: "#stats",
    templates: {
      body(hit) {
        return `<span role="img" aria-label="emoji">⚡️</span> <strong>${
          hit.nbHits
        }</strong> results found ${
          hit.query != "" ? `for <strong>"${hit.query}"</strong>` : ``
        } in <strong>${hit.processingTimeMS}ms</strong>`;
      }
    }
  })
);

// Uncomment the following widget to add categories list.

search.addWidget(
  instantsearch.widgets.refinementList({
    container: "#categories",
    attributeName: "categories",
    autoHideContainer: false,
    templates: {
      header: "Categories"
    }
  })
);

// Uncomment the following widget to add brands list.

search.addWidget(
  instantsearch.widgets.refinementList({
    container: "#brands",
    attributeName: "brand",
    searchForFacetValues: true,
    autoHideContainer: false,
    templates: {
      header: "Brands"
    }
  })
);

// Uncomment the following widget to add price range.

search.addWidget(
  instantsearch.widgets.rangeSlider({
    container: "#price",
    autoHideContainer: false,
    attributeName: "price",
    templates: {
      header: "Price"
    }
  })
);

// Uncomment the following widget to add pagination.

search.addWidget(
  instantsearch.widgets.pagination({
    container: "#pagination"
  })
);

search.start();
