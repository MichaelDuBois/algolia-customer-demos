import instantsearch from "instantsearch.js";
import algoliasearch from "algoliasearch";
import { configure, hits, searchBox, index } from "instantsearch.js/es/widgets";

import {
  connectHits
  // connectRefinementList
} from "instantsearch.js/es/connectors";

let appID = "latency";
let apiKey = "6be0576ff61c053d5f9a3225e2a90f76";
const localStorageKey = "resultUrl";
const urlFields = {
  instant_search: "url",
  STAGING_algolia_com_blog: "permalink"
};
const resultsUrls = {
  instant_search:
    "https://react-instantsearch.netlify.app/examples/e-commerce/search/?query=",
  STAGING_algolia_com_blog: "https://www.algolia.com/search/?tab=blog&query="
};

let queryUrls = {};
let suggestionClicked = false;

const getUrlFromHit = (index, hit) => {
  return hit[urlFields[index]];
};

const getResultUrl = (index, searchTerm) => {
  return `${resultsUrls[index]}${searchTerm}`;
};

const algoliaClient = algoliasearch(appID, apiKey);

const searchClient = {
  async search(requests) {
    const data = await algoliaClient.search(requests);
    const suggestionsIndexName = "query_suggestions";
    const results = data.results.filter(
      (r) => r.index !== suggestionsIndexName
    );

    //assuming the primary index is first
    const primaryIndex = results.shift();
    const searchTerm = primaryIndex.query;
    //console.log(primaryIndex.query);
    //console.log(queryUrls);
    //check if primary index has exactly 1 result
    //if yes, set that url
    //if no:
    //check additional indices to see if exactly 1 has any results
    //if no: clear it out
    //if yes, do the same check for exactly 1 result:
    //if yes, set that url
    //if no, set the url to the results page for that index
    if (!queryUrls[searchTerm]) {
      let redirectUrl = getResultUrl(primaryIndex.index, primaryIndex.query);
      if (primaryIndex.nbHits === 1) {
        redirectUrl = getUrlFromHit(primaryIndex.index, primaryIndex.hits[0]);
      } else if (primaryIndex.nbHits === 0) {
        const additionalIndicesWithResults = results.filter(
          (r) => r.nbHits > 0
        );
        if (additionalIndicesWithResults.length === 1) {
          const index = additionalIndicesWithResults[0];
          if (index.nbHits === 1) {
            redirectUrl = getUrlFromHit(index.index, index.hits[0]);
          } else if (index.nbHits > 0) {
            //redirect to that index's results page
            redirectUrl = getResultUrl(index.index, index.query);
          }
        }
      }
      queryUrls[searchTerm] = redirectUrl;
    }
    if (suggestionClicked === true) {
      window.dispatchEvent(new Event("search"));
    }
    return data;
  },
  searchForFacetValues: algoliaClient.searchForFacetValues
};

const search = instantsearch({
  indexName: "instant_search",
  searchClient: searchClient
});

// Customize UI of the Query Suggestion Hits
const renderQSHits = ({ widgetParams, hits }, isFirstRender) => {
  const container = document.querySelector(widgetParams.container);

  container.innerHTML = `<ul>
    ${hits
      .map(
        (item) => `
        <li class="query-suggestion">
          
          ${instantsearch.highlight({
            hit: item,
            attribute: "query"
          })}
          
        </li>
      `
      )
      .join("")}
  </ul>`;
};

const QSHits = connectHits(renderQSHits);

// Customize UI of the category column
// const renderFederatedRefinement = ({ widgetParams, items }, isFirstRender) => {
//   const container = document.querySelector(widgetParams.container);

//   container.innerHTML = `<ul>
//     ${items
//       .map(
//         (item) => `
//         <li>${item.label}</li>
//       `
//       )
//       .join("")}
//   </ul>`;
// };

// const federatedRefinement = connectRefinementList(renderFederatedRefinement);

// Add the widgets
search.addWidgets([
  configure({
    hitsPerPage: 3,
    removeWordsIfNoResults: "none" //not recommended for live implementations
  }),
  searchBox({
    container: "#search-box",
    placeholder: "Search for products",
    showReset: true,
    showSubmit: true,
    showLoadingIndicator: true
  }),
  hits({
    container: "#products",
    templates: {
      empty: "No results for products",
      item: `
            <div class="item">
                <figure class="hit-image-container"><div class="hit-image-container-box"><img class="hit-image" src="{{image}}" alt=""></div></figure>
                <p class="hit-category">&#8203;​</p>
                <div class="item-content">
                    <p class="brand hit-tag">{{{brand}}}</p>
                    <p class="name">
                      <a href="{{url}}">
                        {{{_highlightResult.name.value}}}
                      </a>
                    </p>
                    <div class="hit-description">\${{price}}</div>
                </div>
            </div>
            <br>`
    }
  }),
  index({
    indexName: "query_suggestions"
  }).addWidgets([
    configure({
      hitsPerPage: 16
    }),
    QSHits({
      container: "#suggestions"
    })
  ]),
  index({
    indexName: "STAGING_algolia_com_blog"
  }).addWidgets([
    hits({
      container: "#blog",
      templates: {
        empty: "No results for blog content",
        item: `
              <div class="item">
              <figure class="hit-image-container"><div class="hit-image-container-box"><img class="hit-image" src="{{avatar_url}}" alt=""></div></figure>
              <p class="hit-category">&#8203;​</p>
                <div class="item-content">
                    <p class="brand hit-tag">{{{_highlightResult.author_name.value}}}</p>
                    <p class="name">
                      <a href="{{permalink}}">
                      {{{_highlightResult.h1.value}}}
                      </a>
                    </p>                    
                    <div class="hit-description">{{{price}}}<b class="hit-currency"></b></div>
                </div>
              </div>
              <br>`
      }
    })
  ])
]);

search.start();

// let searchFormRedirectListener = false;
// Display and hide box on focus/blur
search.on("render", () => {
  const federatedResults = document.querySelector(
    ".federated-results-container"
  );
  const searchBox = document.querySelector(".ais-SearchBox-wrapper");

  const searchInput = searchBox.querySelector("input");
  if (searchInput !== null) {
    searchInput.addEventListener("focus", () => {
      federatedResults.style.display = "grid";
      searchBox.classList.add("is-open");
    });
    window.addEventListener("click", () => {
      federatedResults.style.display = "none";
    });
    searchBox.addEventListener("click", (e) => {
      e.stopPropagation();
    });
    federatedResults.addEventListener("click", (e) => {
      e.stopPropagation();
    });
    const querySuggestions = federatedResults.querySelectorAll(
      ".query-suggestion"
    );
    console.log(window.localStorage);
    if (querySuggestions.length > 0) {
      querySuggestions.forEach((s) => {
        s.addEventListener("click", (e) => {
          suggestionClicked = true;
          //console.log(e.target.innerText);
          search.helper.setQuery(e.target.innerText).search();
        });
      });
    }
  }

  // const searchForm = document.querySelector(".ais-SearchBox-form");
  // if (searchForm && !searchFormRedirectListener) {
  //   searchForm.addEventListener("submit", () => {});
  //   searchFormRedirectListener = true;
  // }
});

window.addEventListener("search", () => {
  const resultUrl = queryUrls[search.helper.state.query];
  console.log(search.helper.state.query);
  if (resultUrl) {
    window.location.href = resultUrl;
    //window.open(resultUrl);
    return false;
  }
});
