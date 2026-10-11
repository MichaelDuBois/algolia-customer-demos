/* global instantsearch */

import { hitTemplate } from "./helpers";
import didYouMeanWidget from "./did-you-mean-widget";

const search = instantsearch({
  appId: "MC0ZV4HHNV",
  apiKey: "5e39eba67a1806a947610c93ce46b1db",
  indexName: "demo_no_results",
  searchParameters: {
    hitsPerPage: 5,
    attributesToSnippet: ["description:24"],
    snippetEllipsisText: "[...]"
  }
});

search.addWidget(didYouMeanWidget);

search.addWidget(
  instantsearch.widgets.hits({
    container: "#hits",
    templates: {
      empty: "",
      item: function(hit) {
        return hitTemplate(hit);
      }
    }
  })
);

search.addWidget(
  instantsearch.widgets.searchBox({
    container: "#searchbox",
    placeholder: 'Search for the term "iphone 9s"',
    autofocus: false
  })
);

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

search.addWidget(
  instantsearch.widgets.pagination({
    container: "#pagination"
  })
);

search.start();
