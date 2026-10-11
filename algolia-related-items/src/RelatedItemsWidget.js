import algoliasearch from "algoliasearch";

export default class RelatedItemsWidget {
  constructor(options) {
    Object.assign(this, options);

    this.searchParameters = {
      ...this.searchParameters,
      removeStopWords: ["en"],
      typoTolerance: "min",
      queryType: "prefixNone",
      attributesToHighlight: "",
      exactOnSingleWordQuery: "word",
      removeWordsIfNoResults: "allOptional",
      hitsPerPage: this.recommendationCount || 3,
      sumOrFiltersScores: true
    };
  }

  init() {
    this._testRootNode();
    this._createNewInsance();
  }

  /**
   * Where the magic happens
   * We take the 1st result from the main search and use this as the basis
   * for the recommendation search
   */
  render({ results }) {
    const firstResult = results.hits[0];

    if (firstResult) {
      const query = firstResult[this.itemTitleAttribute];
      this.index
        .search(query, {
          ...this.searchParameters,
          optionalWords: query.split(" "),
          ...(this._buildFilters(firstResult) && {
            filters: this._buildFilters(firstResult)
          })
        })
        .then(recommendationResults =>
          this._renderRecommendations(recommendationResults)
        );
    }
  }

  _testRootNode() {
    try {
      this.rootNode = document.querySelector(this.container);
      this.rootNode.innerHTML = "";
    } catch {
      throw "Pass object with 'container' attribute on init, must be a vaild query selector e.g. '#container'";
    }
  }

  _createNewInsance() {
    this.client = algoliasearch(this.appID, this.apiKey);
    this.index = this.client.initIndex("alex.webb@algolia.com#atis-prods");
  }

  _buildFilters(firstResult) {
    return `(${this.facets
      .filter(facetName => firstResult[facetName].length)
      .map(facetName => `${facetName}:'${firstResult[facetName]}'`)
      .join(" OR ")}) AND NOT objectID:${firstResult.objectID}`;
  }

  _renderRecommendations(results) {
    const template = results.hits.map(hit => this.template(hit));
    this.rootNode.innerHTML = template;
  }
}
