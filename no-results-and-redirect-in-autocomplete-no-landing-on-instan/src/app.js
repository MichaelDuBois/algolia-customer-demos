import algoliasearch from 'algoliasearch';
import autocomplete from 'autocomplete.js';

const client = algoliasearch('latency', '6be0576ff61c053d5f9a3225e2a90f76');
const index = client.initIndex('instant_search');
const suggestionsIndex = client.initIndex('query_suggestions');

autocomplete(
  '#searchBox input[type=search]',
  {
    hint: false,
    debug: process.env.NODE_ENV === 'development',
  },
  [
    {
      source: function (query, callback) {
        index.search(query, { hitsPerPage: 5, clickAnalytics: true }).then(
          function (answer) {
            if (Array.isArray(answer.userData)) {
              const match = answer.userData.find((data) =>
                Boolean(data.redirect)
              );
              if (match && match.redirect) {
                window.location.href = match.redirect;
              }
            }
            callback(answer.hits);
          },
          function () {
            callback([]);
          }
        );
      },
      displayKey: 'item',
      templates: {
        suggestion(suggestion) {
          return suggestion._highlightResult.name.value;
        },
        empty: function ({ query, isEmpty }) {
          const container = this.$el.get()[0];
          suggestionsIndex
            .search({
              hitsPerPage: 3,
            })
            .then(({ hits }) => {
              const hitsText = hits.map((h) => h.query).join(', ');
              container.innerText = `No results for ${query}. Popular search terms: ${hitsText}`;
            });
        },
      },
    },
  ]
).on('autocomplete:selected', (event, suggestion, dataset) => {
  // eslint-disable-next-line no-console
  console.log({ suggestion, dataset });
});
