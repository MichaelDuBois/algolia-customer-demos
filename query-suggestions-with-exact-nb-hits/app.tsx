import { autocomplete } from "@algolia/autocomplete-js";
import { createQuerySuggestionsPlugin } from "@algolia/autocomplete-plugin-query-suggestions";
import algoliasearch from "algoliasearch";
import pluralize from "pluralize";

import "@algolia/autocomplete-theme-classic";

const appId = "latency";
const apiKey = "6be0576ff61c053d5f9a3225e2a90f76";
const searchClient = algoliasearch(appId, apiKey);

const querySuggestionsPlugin = createQuerySuggestionsPlugin({
  searchClient,
  indexName: "instant_search_demo_query_suggestions",
  transformSource({ source }) {
    return {
      ...source,
      templates: {
        ...source.templates,
        item({ item, components }) {
          return <SuggestionItem hit={item} />;
        }
      }
    };
  }
});

autocomplete({
  container: "#autocomplete",
  placeholder: "Search",
  openOnFocus: true,
  plugins: [querySuggestionsPlugin]
});

function SuggestionItem({ hit }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div>{hit.query}</div>
      <div>
        {hit.instant_search.exact_nb_hits}{" "}
        {pluralize("result", hit.instant_search.exact_nb_hits)}
      </div>
    </div>
  );
}
