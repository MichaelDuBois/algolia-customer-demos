import "./styles.css";

import instantsearch from "instantsearch.js";
import algoliasearch from "algoliasearch";
import { hits } from "instantsearch.js/es/widgets";

import RandomPageWidget from "./RandomPageWidget";
import RelatedItemsWidget from "./RelatedItemsWidget";

class ProductPage {
  constructor() {
    this._createInstantSearchInstance();
    this._addProductDisplayFunctionality();
    this._addRecommendationsWidget();
    this._addNextPreviousWidget();
    this._startSearch();
  }

  _createInstantSearchInstance() {
    this.searchInstance = instantsearch({
      searchClient: algoliasearch(
        "932LAAGOT3",
        "b85d5681109616755112cca90cab92ff"
      ),
      indexName: "alex.webb@algolia.com#atis-prods",
      searchParameters: { hitsPerPage: 1 }
    });
  }

  _addProductDisplayFunctionality() {
    this.searchInstance.addWidget(
      hits({
        container: "#product",
        templates: {
          item: (hit) => `
            <div class="product__image-container">
              <img class="product__image" src="${hit.largeImage}" />
            </div>
            <div class="product__details">
              <div class="product__name">${hit.title}</div>
              <div class="product__stuff">
            </div>
            ${
              hit.categories.length
                ? `<em>Categories</em>: ${hit.categories
                    .splice(0, 3)
                    .join(",")}`
                : ""
            }<br/>
            ${hit.brand.length ? `<em>Brand</em>: ${hit.brand}` : ""}<br/>
            ${hit.type.length ? `<em>Type</em>: ${hit.type}` : ""}<br/>
            </div>`
        }
      })
    );
  }

  _addRecommendationsWidget() {
    this.searchInstance.addWidget(
      new RelatedItemsWidget({
        container: "#recommendations",
        itemTitleAttribute: "title",
        template: (hit) => `
          <li class="recommendations__item">
            <div class="recommendations__image-container">
              <img class="recommendations__image" src="${hit.largeImage}" />
            </div>
            <div class="recommendations__name">${hit.title}</div>
          </li>`,
        appID: "932LAAGOT3",
        apiKey: "b85d5681109616755112cca90cab92ff",
        indexName: "alex.webb@algolia.com#atis-prods",
        facets: ["brand", "type", "categories"]
      })
    );
  }

  _addNextPreviousWidget() {
    this.searchInstance.addWidget(RandomPageWidget);
  }

  _startSearch() {
    this.searchInstance.start();
  }
}

new ProductPage();
