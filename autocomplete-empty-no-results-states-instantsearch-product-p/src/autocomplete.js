const { autocomplete, getAlgoliaResults } = window["@algolia/autocomplete-js"];
const { createQuerySuggestionsPlugin } =
  window["@algolia/autocomplete-plugin-query-suggestions"];
const { algoliasearch } = window;

const searchClient = algoliasearch(
  "3EA6KSSDGW",
  "23fef1254e41ec407b1fc80f852e4a40"
);

const promotedCategories = [
  {
    url: "/category/Family",
    video: "/static/family.mp4",
  },
  {
    url: "/category/Horror",
    video: "/static/horror.mp4",
  },
  {
    url: "/category/Comedy",
    video: "/static/comedy.mp4",
  },
];

const emptySearchSources = [
  {
    sourceId: "directors",
    getItems() {
      return getAlgoliaResults({
        searchClient,
        queries: [
          {
            indexName: "directors",
            hitsPerPage: 5,
            analyticsTags: ["autocomplete_empty_state"],
          },
        ],
      });
    },
    templates: {
      item({ item, html }) {
        return html`<a
          href="/search?${encodeURIComponent(
            "refinementList[director][0]"
          )}=${encodeURIComponent(item.name)}"
          >${item.name}</a
        >`;
      },
      noResult() {
        return "";
      },
      header() {
        return "Directors";
      },
    },
    getItemUrl({ item }) {
      return `/search?${encodeURIComponent(
        "refinementList[director][0]"
      )}=${encodeURIComponent(item.name)}`;
    },
  },
  {
    sourceId: "promotedCategories",
    getItems() {
      return promotedCategories;
    },
    templates: {
      header() {
        return "Promoted Categories";
      },
      item({ item, html }) {
        return html`<a href="${item.url}"
          ><video width="100" height="100" autoplay loop>
            <source src="${item.video}" type="video/mp4" /></video
        ></a>`;
      },
      noResults() {
        return "";
      },
    },
    getItemUrl({ item }) {
      return item.url;
    },
  },
];

//Note we do not use the query suggestion plugin as this is kind of easier
// to manage the conditional source (empty state vs search state) using
// a standard source
const sources = [
  {
    sourceId: "qs",
    getItems({ query }) {
      return getAlgoliaResults({
        searchClient,
        queries: [
          {
            indexName: "movies_query_suggestions",
            query,
            hitsPerPage: 5,
            analyticsTags: ["autocomplete"],
          },
        ],
      });
    },
    templates: {
      header() {
        return "Popular searches";
      },
      item({ item, html }) {
        return item.query;
      },
    },
    getItemInputValue({ item }) {
      return item.query;
    },
    onSelect({ setIsOpen }) {
      setIsOpen(true);
    },
  },
  {
    sourceId: "movies",
    getItems({ query }) {
      return getAlgoliaResults({
        searchClient,
        queries: [
          {
            indexName: "movies",
            query,
            hitsPerPage: 5,
            analyticsTags: ["autocomplete"],
          },
        ],
      });
    },
    templates: {
      item({ item, html }) {
        return html`<a
          href="/product/${item.objectID}?queryID={$item.__queryId}"
          ><img src="${item.poster}" width="100px"
        /></a>`;
      },
      footer({ state, html }) {
        return html`<a href="/search/${encodeURIComponent(state.query)}"
          >see all results</a
        >`;
      },
    },
  },
  {
    /*
      source for no result
      little hack: we always fetch the most popular movies
        then we use a custom render in autocomplete to display
        or not it depending of the movies source status
      /!\ a ruleContexts is pass in order to have to possibility to pin 
        specific products for that context
     */
    sourceId: "noResultsMovies",
    getItems({ query, setContext }) {
      return getAlgoliaResults({
        searchClient,
        queries: [
          {
            indexName: "movies",
            query: "",
            hitsPerPage: 5,
            analyticsTags: ["autocompletenoresult"],
            ruleContexts: ["noresults"],
          },
        ],
      });
    },
    templates: {
      header() {
        return "Popular Movies";
      },
      item({ item, html }) {
        return html`<a
          href="/product/${item.objectID}?queryID={$item.__queryId}"
          ><img src="${item.poster}" width="100px"
        /></a>`;
      },
      footer({ state, html }) {
        return html`<a href="/search/${encodeURIComponent(state.query)}"
          >see all results</a
        >`;
      },
    },
  },
];

const qsPlugin = createQuerySuggestionsPlugin({
  searchClient,
  indexName: "movies_query_suggestions",
  getSearchParams: () => ({ clickAnalytics: true }),
  transformSource({ source, onTapAhead }) {
    return {
      ...source,
      templates: {
        item({ item, html }) {
          return html`${item.query}`;
        },
      },
      onSelect({ item, setIsOpen }) {
        setIsOpen(false);
        //send event to data layer for Tealium
        console.log({
          event: "click on query suggestion",
          algoliaObjectID: item.objectID,
          algoliaIndex: item.__autocomplete_indexName,
          algoliaPosition: item.__autocomplete_id + 1,
          algoliaQueryID: item.__autocomplete_queryID,
        });
        //redirect to search page
      },
    };
  },
});

autocomplete({
  container: "#autocomplete",
  placeholder: "Search for products",
  openOnFocus: true,
  insights: false,
  plugins: [qsPlugin],
  getSources({ query, setContext }) {
    return query === "" ? emptySearchSources : sources;
  },
  onSubmit({ state }) {
    window.location = "/search/" + encodeURIComponent(state.query);
  },
  render({ state, children, html, render, elements }, root) {
    //If query is empty just display as default
    if (state.query === "") {
      render(children, root);
      return;
    }

    //Otherwise check if main source (movies) is
    // empty to change to no result
    const movieCollection = state.collections.find((collection) => {
      return collection.source.sourceId === "movies";
    });

    if (movieCollection) {
      if (movieCollection.items.length === 0) {
        //no result situation
        const { noResultsMovies } = elements;
        render(
          html` <div class="aa-PanelLayout aa-Panel--scrollable">
            <p>No results for "${state.query}"</p>
            ${noResultsMovies}
          </div>`,
          root
        );
      } else {
        //display querySuggestion & movies sections
        const { qs, movies } = elements;
        render(
          html` <div class="aa-PanelLayout aa-Panel--scrollable">
            ${qs}${movies}
          </div>`,
          root
        );
      }
    }
  },
});
