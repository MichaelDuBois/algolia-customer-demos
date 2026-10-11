const { algoliasearch, instantsearch } = window;

const searchClient = algoliasearch(
  'DFFYT6IC2X',
  'a0c3200cdb6e5fa3656f68c99dc8b3b8'
);

const search = instantsearch({
  indexName: 'prod_ECOM',
  searchClient,
});

search.addWidgets([
  instantsearch.widgets.searchBox({
    container: '#searchbox',
  }),
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      item: `
<article>
  <div class="hit-container">
    <div>
      <img src={{image_urls.0}} />
    </div>
    <div>
      <h4>{{name}}</h4>
      <p>Color: {{color.original_name}}</p>
      <p>Price: {{price.value}} {{price.currency}}</p>
      <p>Category: {{hierarchical_categories.lvl2}}</p>
    </div>
  </div>
</article>
`,
    },
  }),
  instantsearch.widgets.configure({
    hitsPerPage: 8,
  }),
  instantsearch.widgets.pagination({
    container: '#pagination',
  }),
]);

search.addWidgets([
  instantsearch.widgets.panel({
    templates: { header: 'brand' },
  })(instantsearch.widgets.refinementList)({
    container: '#brand-list',
    attribute: 'brand',
  }),
]);

search.addWidgets([
  instantsearch.widgets.panel({
    templates: { header: 'Colors' },
  })(instantsearch.widgets.refinementList)({
    container: '#color-list',
    attribute: 'color.filter_group',
    limit: 30,
    templates: {
      item(hit, { html }) {
        console.log(hit);
        return html`<input
            type="checkbox"
            class="hidden"
            id="color-${hit.label.split(';')[0]}"
            ${hit.isRefined && html`checked`}
          />
          <span
            class="color-swatch ${hit.isRefined && html`isRefined`}"
            style="background-color: ${hit.label.split(';')[1]}"
          ></span> `;
      },
    },
  }),
]);

search.start();
