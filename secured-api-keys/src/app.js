/* global instantsearch algoliasearch */

// PARAMETERS SHARE BETWEEN BACK AND FRONTEND
const SERVER_DATA = window.SERVER_DATA;
const user = window.USER;
const index = window.INDEX;

// CLEAN PARAMETERS INFO
delete window.SERVER_DATA;
delete window.USER;
delete window.INDEX;

const searchClient = algoliasearch("U34K6693NA", SERVER_DATA.ALGOLIA_API_KEY);
const suggestionClient = algoliasearch(
  "U34K6693NA",
  "YOUR_SEARCH_ONLY_PARENT_API_KEY"
);

let search = instantsearch({
  indexName: index,
  routing: true,
  searchClient
});

const suggestions = instantsearch({
  indexName: "GOODFOOD_NS_EN_query_suggestions",
  searchClient: suggestionClient
});

const autocomplete = instantsearch.connectors.connectAutocomplete(
  ({ indices, refine, widgetParams }, isFirstRendering) => {
    const { container, onSelectChange, onType } = widgetParams;

    if (isFirstRendering) {
      container.html('<select id="ais-autocomplete"></select>');

      container.find("select").selectize({
        options: [],
        valueField: "query",
        labelField: "query",
        highlight: false,
        onType(value) {
          onType(value);
        },
        // onBlur() {
        //   refine(this.getValue());
        // },
        score() {
          return function () {
            return 1;
          };
        },
        onChange(value) {
          onSelectChange(value);
          refine(value);
        }
      });

      return;
    }

    const [select] = container.find("select");

    indices.forEach((index) => {
      select.selectize.clearOptions();
      index.results.hits.forEach((h) => select.selectize.addOption(h));
      select.selectize.refreshOptions(select.selectize.isOpen);
    });
  }
);

const hits = instantsearch.widgets.hits({
  container: "#hits",
  templates: {
    item: (hit) => {
      let price = 0;

      if (!hit[user.province][user.facility]["price"]) {
        price = hit[user.province]["plan_prices"][user.price_set];
      } else {
        price =
          hit[user.province][user.facility]["price"][
            "transit_days_" + user.transitDays
          ];
      }

      return `
        <img src="${hit["image"]}" style="width: 100%; height: auto" />
        <h3>${hit["name"]}</h3>
        <p>Price: \$${price}</p>
        <p>Promo: ${hit["is_promo"]}</p>
      `;
    }
  }
});

suggestions.addWidgets([
  instantsearch.widgets.configure({
    hitsPerPage: 5
  }),
  autocomplete({
    container: $("#searchbox"),
    onSelectChange(value) {
      search.helper.setQuery(value).search();
    },
    onType(value) {
      search.helper.setQuery(value).search();
    }
  })
]);

search.addWidgets([
  instantsearch.widgets.panel({
    templates: {
      header: "Categories"
    }
  })(instantsearch.widgets.refinementList)({
    container: "#categories",
    attribute: "categories"
  }),
  instantsearch.widgets.panel({
    templates: {
      header: "Allergens"
    }
  })(instantsearch.widgets.refinementList)({
    container: "#allergens",
    attribute: "allergens"
  }),
  instantsearch.widgets.panel({
    templates: {
      header: "Prices Range"
    }
  })(instantsearch.widgets.rangeSlider)({
    container: "#price",
    attribute: `${user.province}.price`
  }),
  hits,
  instantsearch.widgets.stats({
    container: "#stats"
  }),
  // instantsearch.widgets.searchBox({
  //   container: "#searchbox",
  //   placeholder: 'Search for an excelent product to buy',
  //   autofocus: true,
  // }),
  instantsearch.widgets.currentRefinements({
    container: "#current-refinements"
  }),
  instantsearch.widgets.pagination({
    container: "#pagination"
  })
  // instantsearch.widgets
  //   .index({ indexName: 'GOODFOOD_NS_EN_query_suggestions' })
  //   .addWidgets([
  //     instantsearch.widgets.configure({
  //       hitsPerPage: 5
  //     }),
  //     autocomplete({
  //       container: $('#searchbox'),
  //       onSelectChange(value) {
  //         search.helper.setQuery(value).search();
  //       },
  //     }),
  //   ])
]);

search.start();
suggestions.start();
