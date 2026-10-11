import { h } from 'preact';
import {
  frequentlyBoughtTogether,
  relatedProducts,
} from '@algolia/recommend-js';
import recommend from '@algolia/recommend';

const appId = 'U9UXVSI686';
const apiKey = '737b3e1269f8cc2eeb6f8844b750996f';
const recommendClient = recommend(appId, apiKey);

const indexName = 'prod_ECOM_recommend';

// Other objectID for testing: M0E20000000E2QT
const currentObjectID = 'M0E20000000E2NX';

frequentlyBoughtTogether({
  container: '#frequentlyBoughtTogether',
  recommendClient,
  indexName,
  objectIDs: [currentObjectID],
  itemComponent({ item }) {
    return (
      <div>
        <img class="product-img" src={item.image_urls[0]}></img>
        <div class="product-details">
          <p class="product-name">{item.name}</p>
        </div>
      </div>
    );
  },
});

relatedProducts({
  container: '#relatedProducts',
  recommendClient,
  indexName,
  objectIDs: [currentObjectID],
  itemComponent({ item }) {
    return (
      <div>
        <img class="product-img" src={item.image_urls[0]}></img>
        <div class="product-details">
          <p class="product-name">{item.name}</p>
        </div>
      </div>
    );
  },
});
