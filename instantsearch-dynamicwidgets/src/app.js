/* global algoliasearch instantsearch */

const searchClient = algoliasearch(
  'IG9MPJA4PF',
  '591a4a9eceb5c0865c8f17ab72a18e12'
);

const search = instantsearch({
  indexName: 'Product_301',
  searchClient,
});

/* Creating Insights Middleware to send events  */
const insightsMiddleware = instantsearch.middlewares.createInsightsMiddleware({
  insightsClient: window.aa,
});
aa('setUserToken', 'test');

/* adding InstantSearch widgets*/
search.addWidgets([
  instantsearch.widgets.searchBox({
    container: '#searchbox',
    placeholder: 'what are you looking for?',
  }),
  /* Display Current Refinements */
  instantsearch.widgets.currentRefinements({
    container: '#current_refinements',
  }),
  /* ClearRefinements */
  instantsearch.widgets.clearRefinements({
    container: '#clear-refinements',
  }),
  /* Display hits & track events */
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      item(hit, bindEvent) {
        return `<article class="article">
          <div class="hit-image">
          </div>
          <img src="${hit.image}" width="70%" >
          <h3>${instantsearch.highlight({
            attribute: 'name',
            hit,
          })}</h3>
          <p>${instantsearch.snippet({ attribute: 'description', hit })}...</p>
          <button class="add-to-cart-btn" "type="button" ${bindEvent(
            'click',
            hit,
            'Product Added'
          )}>
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

  /* Implementing DynamicWidgets and Facets */
  instantsearch.widgets.dynamicWidgets({
    container: '#dynamic-widgets',
    widgets: [
      /* RefinementList */
      (container) =>
        instantsearch.widgets.panel({
          templates: { header: 'Brand' },
        })(instantsearch.widgets.refinementList)({
          container,
          attribute: 'brand',
          searchable: true,
          searchablePlaceholder: 'search for brand',
        }),
      /* toggleRefinement */
      (container) =>
        instantsearch.widgets.panel({
          templates: { header: 'free shipping' },
        })(instantsearch.widgets.toggleRefinement)({
          container,
          attribute: 'free_shipping',
          templates: {
            labelText: 'Free shipping',
          },
        }),
      /* RatingMenu */
      (container) =>
        instantsearch.widgets.panel({
          templates: { header: 'rating' },
        })(instantsearch.widgets.ratingMenu)({
          container,
          attribute: 'rating',
        }),
      /* RangeSlider*/
      (container) =>
        instantsearch.widgets.panel({
          templates: { header: 'price (€)' },
        })(instantsearch.widgets.rangeSlider)({
          container,
          attribute: 'price',
          precision: 0,
          step: 50,
          pips: false,
        }),
      /* HierarchicalMenu */
      (container) =>
        instantsearch.widgets.panel({
          templates: { header: 'category' },
        })(instantsearch.widgets.hierarchicalMenu)({
          container,
          showParentLevel: false,
          attributes: [
            'hierarchicalCategories.lvl0',
            'hierarchicalCategories.lvl1',
            'hierarchicalCategories.lvl2',
            'hierarchicalCategories.lvl3',
            'hierarchicalCategories.lvl4',
          ],
        }),
    ],
  }),
]);

search.use(insightsMiddleware);
search.start();
