import instantsearch from 'instantsearch.js';
import {
  index,
  searchBox,
  configure,
  stats,
  hits,
  pagination,
  refinementList,
} from 'instantsearch.js/es/widgets';
import algoliasearch from 'algoliasearch';

const search = instantsearch({
  indexName: 'prod_index_test_veterans_advantage',
  searchClient: algoliasearch('UJFKCC3IIF', '51911bb7c9869cbb46a885be50864e1f'),
});

search.addWidgets([
  searchBox({
    container: '#searchbox',
  }),
]);

// Define the parent index widget for getting the number of hits
// that should be associated with all label in the content type selection
const all = index({
  indexName: 'prod_index_test_veterans_advantage',
});

all.addWidgets([
  configure({
    facetFilters: [['content_type:offer', 'content_type:blog_post']],
  }),
  stats({
    container: '#all-label',
    templates: {
      text(data, { html }) {
        return html`<span> All (${data.nbHits}) </span>`;
      },
    },
  }),
]);

// Define the index widget for the widgets associated with rendering offers
// results when all content-types are selected for search
const offersAll = index({
  indexName: 'prod_index_test_veterans_advantage',
});

offersAll.addWidgets([
  configure({
    hitsPerPage: 2,
    facetFilters: ['content_type:offer'],
  }),
  hits({
    container: '#hits-offers-all',
    templates: {
      item: `
<article>
  <h1>{{#helpers.highlight}}{ "attribute": "va_title" }{{/helpers.highlight}}</h1>
  <p>{{#helpers.highlight}}{ "attribute": "meta_description" }{{/helpers.highlight}}</p>
</article>
`,
    },
  }),
  stats({
    container: '#offer-label',
    templates: {
      text(data, { html }) {
        return html`<span> Offer (${data.nbHits}) </span>`;
      },
    },
  }),
]);

// Define the index widget for the widgets associated with rendering content
// results when all content-types are selected for search
const contentAll = index({
  indexName: 'prod_index_test_veterans_advantage',
});

contentAll.addWidgets([
  configure({
    hitsPerPage: 2,
    facetFilters: ['content_type:blog_post'],
  }),
  hits({
    container: '#hits-content-all',
    templates: {
      item: `
<article>
  <h1>{{#helpers.highlight}}{ "attribute": "va_title" }{{/helpers.highlight}}</h1>
  <p>{{#helpers.highlight}}{ "attribute": "meta_description" }{{/helpers.highlight}}</p>
</article>
`,
    },
  }),
  stats({
    container: '#content-label',
    templates: {
      text(data, { html }) {
        return html`<span> Content (${data.nbHits}) </span>`;
      },
    },
  }),
]);

// Define the index widget for the widgets associated with rendering offers
// results when offers content-type is selected for search
const offers = index({
  indexName: 'prod_index_test_veterans_advantage',
});

offers.addWidgets([
  configure({
    hitsPerPage: 10,
    facetFilters: ['content_type:offer'],
  }),
  pagination({
    container: '#pagination-offers',
  }),
  refinementList({
    container: '#category-list',
    attribute: 'offer_category',
  }),
  hits({
    container: '#hits-offers',
    templates: {
      item: `
<article>
  <h1>{{#helpers.highlight}}{ "attribute": "va_title" }{{/helpers.highlight}}</h1>
  <p>{{#helpers.highlight}}{ "attribute": "meta_description" }{{/helpers.highlight}}</p>
</article>
`,
    },
  }),
]);

// Define the index widget for the widgets associated with rendering content
// results when content content-type is selected for search
const content = index({
  indexName: 'prod_index_test_veterans_advantage',
});

content.addWidgets([
  configure({
    hitsPerPage: 10,
    facetFilters: ['content_type:blog_post'],
  }),
  pagination({
    container: '#pagination-content',
  }),
  hits({
    container: '#hits-content',
    templates: {
      item: `
<article>
  <h1>{{#helpers.highlight}}{ "attribute": "va_title" }{{/helpers.highlight}}</h1>
  <p>{{#helpers.highlight}}{ "attribute": "meta_description" }{{/helpers.highlight}}</p>
</article>
`,
    },
  }),
]);

search.addWidgets([offersAll, contentAll, content, offers, all]);

search.start();

// The logic below handles switching between content-types.
document.querySelectorAll('input[name="placement"]').forEach((radio) => {
  radio.addEventListener('change', (event) => {
    const target = event.target;
    const contentType = target.value;

    switch (contentType) {
      case 'all':
        showAll();
        hideContent();
        hideOffers();
        break;
      case 'offers':
        hideAll();
        hideContent();
        showOffers();
        break;
      case 'content':
        hideAll();
        showContent();
        hideOffers();
        break;
      default:
        showAll();
        hideContent();
        hideOffers();
        break;
    }
  });
});

function hideContent() {
  var x = document.getElementById('results-content');
  x.style.display = 'none';
}

function showContent() {
  var x = document.getElementById('results-content');
  x.style.display = 'block';
}

function showAll() {
  var x = document.getElementById('results-all');
  x.style.display = 'block';
}

function hideAll() {
  var x = document.getElementById('results-all');
  x.style.display = 'none';
}

function showOffers() {
  var x = document.getElementById('results-offers');
  x.style.display = 'block';

  var y = document.getElementById('filter-offers');
  y.style.display = 'block';
}

function hideOffers() {
  var x = document.getElementById('results-offers');
  x.style.display = 'none';

  var y = document.getElementById('filter-offers');
  y.style.display = 'none';
}
