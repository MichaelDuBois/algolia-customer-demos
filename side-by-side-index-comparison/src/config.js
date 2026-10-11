const APP_ID = 'U9UXVSI686';
const API_KEY = '3b37db9a09b3c2cb879eb273c07db28b';
const INDICES = ['prod_ECOM', 'prod_ECOM_custom_ranking_reviews'];

const CONFIG_INDEX_A = [
  {
    text: 'name',
    attribute: 'name',
  },
  {
    text: 'categories',
    attribute: 'list_categories',
  },
  {
    text: 'brand',
    attribute: 'brand',
  },
  {
    text: 'price',
    attribute: 'price.value',
  },
  {
    text: 'in stock',
    attribute: 'stock',
  },
];

const CONFIG_INDEX_B = [
  {
    text: 'name',
    attribute: 'name',
  },
  {
    text: 'categories',
    attribute: 'list_categories',
  },
  {
    text: 'brand',
    attribute: 'brand',
  },
  {
    text: 'price',
    attribute: 'price.value',
  },
  {
    text: 'in stock',
    attribute: 'stock',
  },
];

export { APP_ID, API_KEY, INDICES, CONFIG_INDEX_A, CONFIG_INDEX_B };
