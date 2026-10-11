/* global instantsearch */

import { hitTemplate } from "./helpers";

const search = instantsearch({
  appId: "SYZEVV63H0",
  apiKey: "d6c31e462f5bf39c91571f511a068967",
  indexName: "instant_search",
  searchParameters: {
    hitsPerPage: 5,
    attributesToSnippet: ["description:24"],
    snippetEllipsisText: " [...]"
  }
});

// Uncomment the following widget to add a search bar.

search.addWidget(
  instantsearch.widgets.searchBox({
    container: "#searchbox",
    placeholder: "Search for products",
    autofocus: false
  })
);

// Uncomment the following widget to add hits list.

search.addWidget(
  instantsearch.widgets.hits({
    container: "#hits",
    templates: {
      empty: function (res) {
        // Do something on No results

        // Option: Render some text
        const noResultsText = document.getElementById("no-results-text");
        noResultsText.innerText = `No results for query: "${res.query}"`;

        // Option: Trigger Rule and display banner
        // https://www.algolia.com/doc/api-reference/api-parameters/ruleContexts/
        // https://www.algolia.com/doc/guides/managing-results/rules/merchandising-and-promoting/how-to/add-banners/
        const client = search.client;
        const index = client.initIndex("instant_search");
        index
          .search({
            ruleContexts: ["no_results_banner"]
          })
          .then((res) => {
            if (res.userData && res.userData[0].banner_url) {
              const noResultsImg = document.getElementById("no-results-img");
              noResultsImg.src = res.userData[0].banner_url;
            }
            return [];
          });
      },
      item: function (hit) {
        return hitTemplate(hit);
      }
    }
  })
);

search.start();
