const { instantsearch, searchClient } = window;
const { connectCurrentRefinements } = instantsearch.connectors;

function renderInstantSearch(isCategoryPage, param) {
  const configure = {};

  if (isCategoryPage) {
    configure.filters = `genres:${param}`;
    configure.analyticsTags = [
      "category_page",
      "category_page_" + param.toLowerCase().replace(" ", "_"),
    ];
  } else {
    configure.analyticsTags = ["search_page"];
    configure.query = param;
  }

  //Override search client to handle noresult

  const searchClientWithNoResult = {
    ...searchClient,
    search(requests) {
      //simply hide #noresults at each request
      document.querySelector("#noresults").style.display = "none";
      return searchClient.search(requests);
    },
  };

  const search = instantsearch({
    indexName: "movies",
    searchClient: searchClientWithNoResult,
    insights: true,
    routing: {
      stateMapping: instantsearch.stateMappings.singleIndex("movies"),
    },
  });

  //=== custom current refinement for toggle display

  //render one attribute of refinement
  const createDataAttribtues = (refinement) =>
    Object.keys(refinement)
      .map((key) => `data-${key}="${refinement[key]}"`)
      .join(" ");

  const renderListItem = (item) => {
    console.log(item);
    if (item.attribute === "on_sale") {
      //togle
      return `<li class="ais-CurrentRefinements-item">
      <span class="ais-CurrentRefinements-label">${item.label}</span>
      <span class="ais-CurrentRefinements-category"><button class="ais-CurrentRefinements-delete" ${createDataAttribtues(
        item.refinements[0]
      )}>X</button></span>
      </li>`;
    }
    return `
  <li class="ais-CurrentRefinements-item">
    <span class="ais-CurrentRefinements-label">${item.label}:</span>
      ${item.refinements
        .map(
          (refinement) =>
            `<span class="ais-CurrentRefinements-category">
              <span class="CurrentRefinements-categoryLabel">${
                refinement.label
              }</span>
              <button class="ais-CurrentRefinements-delete" ${createDataAttribtues(
                refinement
              )}>X</button>
            </span>`
        )
        .join(" ")}
  </li>
  `;
  };

  const renderCurrentRefinements = (renderOptions, isFirstRender) => {
    const { items, canRefine, refine, createURL, widgetParams } = renderOptions;

    if (isFirstRender) {
      // Do some initial rendering and bind events
    }

    const container = document.querySelector(widgetParams.container);

    if (!canRefine) {
      container.innerHTML = "";
      return;
    }

    // Render the widget
    container.innerHTML = `
    <div class="ais-CurrentRefinements">
      <ul class="ais-CurrentRefinements-list">
        ${items.map(renderListItem).join("")}
      </ul>
    </div>
    `;

    [...container.querySelectorAll("button")].forEach((element) => {
      element.addEventListener("click", (event) => {
        const item = Object.keys(event.currentTarget.dataset).reduce(
          (acc, key) => ({
            ...acc,
            [key]: event.currentTarget.dataset[key],
          }),
          {}
        );

        refine(item);
      });
    });
  };

  const customCurrentRefinements = connectCurrentRefinements(
    renderCurrentRefinements
  );

  //=== END custom currentRefinements

  search.addWidgets([
    instantsearch.widgets.configure(configure),
    instantsearch.widgets.infiniteHits({
      container: "#hits",
      cache: instantsearch.createInfiniteHitsSessionStorageCache(),
      templates: {
        empty: (results, { html }) => {
          //No results, we'll trigger a custom search to display popular products
          // this could later be done with Algolia Recommend
          // note that this method is expecting html output so we are using
          // here another container to manage our no results display
          searchClient
            .initIndex("movies")
            .search("", {
              ruleContexts: ["noresults"],
            })
            .then((results) => {
              const products = results.hits
                .map((hit) => {
                  return `<li>${hit.objectID} - ${hit.title}</li>`;
                })
                .join("");
              document.querySelector("#noresults").style.display = "block";
              document.querySelector("#noresults").innerHTML = `
                <p>No results, most popular results</p>
                <ul>
                  ${products}
                </ul>
              `;
            });

          return "";
        },
        item: (hit, { html, sendEvent }) => {
          return html`<div
            onclick=${() => {
              sendEvent("click", hit, "item clicked");
            }}
          >
            <a href="/product/${hit.objectID}?queryID=${hit.__queryID}">
              <img src="${hit.poster}" width="150" />
              <h2>${hit.title}</h2>
              <button
                class="addToCard"
                data-objectID="${hit.objectID}"
                data-queryID="${hit.__queryID}"
                onclick=${(event) => {
                  // will be triggered by global listener sendEvent("conversion", hit, "item added to cart");
                  sendEvent("click", hit, "item clicked");
                  alert(`product ${hit.objectID} added to cart`);
                  event.preventDefault();
                }}
              >
                Add to card
              </button>
            </a>
          </div>`;
        },
      },
    }),
    /*customCurrentRefinements({
      container: "#customCurrentRefinements",
      transformItems(items) {
        const labels = {
          actors: "Showing Actors",
          director: "Showing Directors",
          on_sale: "On Sales"
        };
        return items.map((refinement) => {
          refinement.label = labels[refinement.attribute] || refinement.label;
          if (refinement.attribute === "on_sale") {
            refinement.refinements[0].label = "activated";
          }
          return refinement;
        });

        //console.log(items);
        //return items;
      }
    }),*/
    instantsearch.widgets.currentRefinements({
      container: "#currentRefinements",
      transformItems(items) {
        const labels = {
          actors: "Showing Actors",
          director: "Showing Directors",
          on_sale: "On Sales",
        };

        return items.map((refinement) => {
          refinement.label = labels[refinement.attribute] || refinement.label;
          if (refinement.attribute === "on_sale") {
            refinement.refinements[0].label = "activated";
          }
          return refinement;
        });
      },
    }),
    instantsearch.widgets.panel({
      templates: { header: "Genre" },
    })(instantsearch.widgets.refinementList)({
      container: "#genres",
      attribute: "genres",
    }),
    instantsearch.widgets.panel({
      templates: { header: "Actors" },
    })(instantsearch.widgets.refinementList)({
      container: "#actors",
      attribute: "actors",
    }),
    instantsearch.widgets.panel({
      templates: { header: "Directors" },
    })(instantsearch.widgets.refinementList)({
      container: "#directors",
      attribute: "director",
    }),
    instantsearch.widgets.toggleRefinement({
      container: "#onsale",
      attribute: "on_sale",
      templates: {
        labelText({ count }, { html }) {
          return html`<span>En promo (${count})</span>`;
        },
      },
    }),
    instantsearch.widgets
      .index({
        indexName: "movies",
        indexId: "noresults",
      })
      .addWidgets([
        instantsearch.widgets.configure({
          query: "",
          facets: null,
          ruleContexts: ["noresults"],
        }),
      ]),
  ]);

  search.start();
}

export function renderSearchPage(query) {
  query = decodeURIComponent(query);
  document.getElementById("title").innerHTML = `Votre recherche : ${query}`;
  renderInstantSearch(false, query);
}

export function renderCategoryPage(category) {
  category = decodeURIComponent(category);
  document.getElementById("title").innerHTML = `${category}`;
  renderInstantSearch(true, category);

  //Send event on catageroy page viewed = filter viewed
  window.aa("viewedFilters", {
    index: "movies",
    eventName: "Category Page Viewed",
    filters: [`genre:${category}`],
  });
}

if (module.hot) {
  module.hot.accept(function () {
    window.location.reload();
  });
}
