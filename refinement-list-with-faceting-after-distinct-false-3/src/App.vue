<template>
  <div>
    <header class="header">
      <h1 class="header-title">
        <a href="/">
          vue-instantsearch-app
        </a>
      </h1>
      <p class="header-subtitle">
        using
        <a href="https://github.com/algolia/vue-instantsearch">
          Vue InstantSearch
        </a>
      </p>
    </header>

    <div class="container">
      <ais-instant-search :search-client="searchClient" index-name="shoes">
        <ais-configure :facetingAfterDistinct="true" />
        <div class="search-panel">
          <div class="search-panel__filters">
            <h3>Brand</h3>
            <ais-refinement-list attribute="brand" />
            
          </div>

          <ais-index index-name="shoes">
              <ais-configure :facetingAfterDistinct="false" />
              <div class="search-panel__filters-stats">
                <ais-stats/>
              </div>
              <div class="search-panel__filters-colour">
                <h3>Colour</h3>
                <ais-refinement-list attribute="colour" />
              </div>

            <div class="search-panel__results">
              <div class="searchbox">
                <ais-search-box placeholder="" />
              </div>
                <ais-hits>
                  <template slot="item" slot-scope="{ item }">
                    <article>
                      <h1>{{item.title}}</h1>
                      <p>{{item.colour}}</p>
                      <p>{{item.brand}}</p>
                      <p>{{item.objectID}}</p>
                    </article>
                  </template>
                </ais-hits>

                <div class="pagination">
                  <ais-pagination />
                </div>
            </div>

            </ais-index>

        </div>
      </ais-instant-search>
    </div>
  </div>
</template>

<script>
import algoliasearch from 'algoliasearch/lite';

export default {
  data() {
    return {
      searchClient: algoliasearch('SXDY3EO0TR', 'a846bb11aaa2a2ae725a722206ec44a6'),
    };
  },
};
</script>

<style>
body,
h1 {
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
    Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
}

em {
  background: cyan;
  font-style: normal;
}

.header {
  display: flex;
  align-items: center;
  min-height: 50px;
  padding: 0.5rem 1rem;
  background-image: linear-gradient(to right, #4dba87, #2f9088);
  color: #fff;
  margin-bottom: 1rem;
}

.header a {
  color: #fff;
  text-decoration: none;
}

.header-title {
  font-size: 1.2rem;
  font-weight: normal;
}

.header-title::after {
  content: ' ▸ ';
  padding: 0 0.5rem;
}

.header-subtitle {
  font-size: 1.2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.search-panel {
  display: flex;
}

.search-panel__filters {
  order: 1;
}

.search-panel__filters-stats {
  order: 1;
}

.search-panel__filters-colour {
  order: 3;
}

.search-panel__results {
  order: 4;
}

.searchbox {
  margin-bottom: 2rem;
}

.pagination {
  margin: 2rem auto;
  text-align: center;
}
</style>
