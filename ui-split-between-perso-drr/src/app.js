import personalisedHits from './personalisedHits.js';

/* global algoliasearch instantsearch */

const searchClient = algoliasearch(
  'F9VBJLR1BK',
  '8c956f9b65d3ed9680ffa6e51b540544'
);

const search = instantsearch({
  indexName: 'prod_BILKATOGO_PRODUCTS',
  searchClient,
});

search.addWidgets([
  instantsearch.widgets.configure({
    enablePersonalization: false,
  }),
  instantsearch.widgets.searchBox({
    container: '#searchbox',
    placeholder: 'what are you looking for?',
  }),
  instantsearch.widgets
    .index({
      indexName: 'prod_BILKATOGO_PRODUCTS',
    })
    .addWidgets([
      instantsearch.widgets.configure({
        enablePersonalization: true,
        userToken: '2d2a1ab1-6659-4bd6-87a9-022fd51dbe83',
        hitsPerPage: 4,
        getRankingInfo: true,
      }),
      // Use custom widget from personalisedHits.js
      personalisedHits({
        container: '#perso-hits',
        panelHeader: 'Personalized Results',
      }),
    ]),
  /* Display Current Refinements */
  instantsearch.widgets.currentRefinements({
    container: '#current_refinements',
  }),
  /* ClearRefinements */
  instantsearch.widgets.clearRefinements({
    container: '#clear-refinements',
  }),
  /* Display hits */
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      item(hit) {
        return `<article class="article">
          <div class="hit-image">
          </div>
          <img src="${hit.images}" width="70%" >
          <h3>${instantsearch.highlight({
            attribute: 'name',
            hit,
          })}</h3>
          <button class="add-to-cart-btn" "type="button" >
            Add to cart
          </button>
        </article>`;
      },
    },
  }),
  /* Pagination */
  instantsearch.widgets.pagination({
    container: '#pagination',
  }),

  instantsearch.widgets.refinementList({
    container: '#refinement-list',
    attribute: 'brand',
  }),
]);

search.start();
