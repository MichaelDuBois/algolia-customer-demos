const renderHits = (renderOptions) => {
  // Get hits from state
  const { hits, widgetParams } = renderOptions;
  // Filter hits based on perso score
  const persoHits = hits.filter(
    (hit) => hit._rankingInfo.personalization.filtersScore > 0
  );
  // Get Dom container
  const container = document.querySelector(widgetParams.container);

  // Render hits
  if (persoHits.length) {
    container.innerHTML = `
      <!-- Use Panel Header From Options -->
      <h3>${widgetParams.panelHeader}</h3>
      <!-- Build Container Using instant search classes-->
      <div class="ais-hits">
        <ol class="ais-Hits-list">
          <!-- Loop hits to display -->
          ${persoHits
            .map(
              (hit) => `
              <li class="ais-Hits-item">
                <article class="article">
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
                </article>
              </li>`
            )
            .join('')}  
        </ol>
      </div>`;
  } else {
    container.innerHTML = '';
  }
};

// Export custom widget
export default instantsearch.connectors.connectHits(renderHits);
