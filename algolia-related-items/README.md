# Algolia Related Items

## Pre Requisites

1. Algolia powered item detail page
2. Instant Search powered page

## Install

1. Copy RelatedItemsWidget.js to your source folder
2. Import widget to your project
3. Configure as bellow

## Configuration Options

| param                           | type     | description                                                |
| :------------------------------ | :------- | :--------------------------------------------------------- |
| `container (required)`          | `string` | `query selector for your recommendations`                  |
| `itemTitleAttribute (required)` | `string` | `attribute name to use for the title of the product`       |
| `template (required)`           | `func`   | `an function that returns a template to render`            |
| `appID (required)`              | `string` | `the app id of recommended items index`                    |
| `apiKey (required)`             | `string` | `the search api key of the recommended items index`        |
| `indexName (required)`          | `string` | `the recommended items index name`                         |
| `facets (required)`             | `array`  | `any facets you want include to improve recommended items` |

## Example usage

```js
this.searchInstance.addWidget(
  new RelatedItemsWidget({
    container: "#recommendations",
    itemTitleAttribute: "title",
    template: hit => `
          <li class="recommendations__item">
            <div class="recommendations__image-container">
              <img class="recommendations__image" src="${hit.largeImage}" />
            </div>
            <div class="recommendations__name">${hit.title}</div>
          </li>`,
    appID: "xxxxxx",
    apiKey: "xxxxxxxxxxxxxxxxx",
    indexName: "alex.webb@algolia.com#atis-prods",
    facets: ["brand", "categories"]
  })
);
```
