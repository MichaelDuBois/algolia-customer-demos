const querySuggestionsIndex = "demo_no_results_query_suggestions";
const containerID = "did-you-mean";
let derivedHelper;

/**
 * @private
 * Creates an instance of the derrived helper
 * @see https://community.algolia.com/algoliasearch-helper-js/reference.html#AlgoliaSearchHelper#derive
 * @returns void
 */
function _createDerivedHelper(helper) {
  derivedHelper = helper.derive(searchParams => {
    // The method setIndex returns a new set of params which we assign to a new var
    let derivedHelperParams = searchParams.setIndex(querySuggestionsIndex);
    // For immutability of searchParams, use methods to make changes, each method returns a new instance of the searchParams
    derivedHelperParams = derivedHelperParams.setQueryParameter(
      "optionalWords",
      searchParams.query.split(" ")
    );
    // Again, return the new instance
    derivedHelperParams = derivedHelperParams.setQueryParameter(
      "hitsPerPage",
      2
    );

    derivedHelperParams = derivedHelperParams.setQueryParameter(
      "exactOnSingleWordQuery",
      "attribute"
    );

    return derivedHelperParams;
  });
}

function _registerEvents(helper) {
  const links = document.querySelectorAll(".alternative-query");

  links.forEach(link => {
    link.addEventListener("click", event => {
      const target = event.target;
      helper.setQuery(target.dataset.query);
      helper.search();
    });
  });
}

/**
 * @private
 * Custom render function to handle the no results display
 */
function _renderNoResults(results, helper) {
  const container = document.getElementById(containerID);

  container.innerHTML = `
    <div class="did-you-mean">
      ${
        results.hits.length
          ? `<p> 
          Why not try:
            ${results.hits
              .map(
                hit =>
                  `<a class="alternative-query" data-query="${hit.query}"> 
                    ${hit.query}
                    </a>`
              )
              .join(", ")}
          </p>`
          : ""
      }
      </div>`;

  _registerEvents(helper);

  container.style.display = "block";
}

/**
 * The custom widget init function for Instant Search JS
 * @see https://community.algolia.com/instantsearch.js/v2/guides/custom-widget.html
 * @returns void
 */
function init({ helper }) {
  _createDerivedHelper(helper);

  derivedHelper.on("result", results => {
    _renderNoResults(results, helper);
  });
}

export default { init };
