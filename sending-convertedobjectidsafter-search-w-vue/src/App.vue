<template>
  <main role="main">
    <div class="o-wrapper">
      <InstantSearch
        :search-client="instantsearch.client"
        :index-name="productIndex"
      >
        <Configure :clickAnalytics="true" />
        <div class="o-layout o-layout--large u-padding-bottom">
          <div class="o-layout__item u-1/4@desktop">
            <Panel class="search-panel">
              <div class="search-panel__filters">
                <HierarchicalMenu
                  :attributes="[
                    'categories.lvl0',
                    'categories.lvl1',
                    'categories.lvl2',
                  ]"
                />
              </div>
            </Panel>
          </div>

          <div class="o-layout__item u-3/4@desktop">
            <section class="o-search-section">
              <SearchBox v-model="query" autofocus />

              <Stats>
                <template slot-scope="{ nbHits }">
                  <h3 class="subheader">Products ({{ nbHits }})</h3>
                </template>
              </Stats>

              <Hits>
                <template slot="item" slot-scope="{ item }">
                  <button @click="triggerInsights(item)" type="button">
                    {{ item.name }} query ID: {{ item.__queryID }}
                  </button>
                </template>
              </Hits>

              <Pagination></Pagination>
            </section>
          </div>
        </div>
      </InstantSearch>
    </div>
  </main>
</template>

<script>
import algoliasearch from 'algoliasearch/lite';
import searchInsights from 'search-insights';
import { createServerRootMixin } from 'vue-instantsearch/src/util/createServerRootMixin';
import Configure from 'vue-instantsearch/src/components/Configure';
import HierarchicalMenu from 'vue-instantsearch/src/components/HierarchicalMenu';
import Hits from 'vue-instantsearch/src/components/Hits';
import InstantSearch from 'vue-instantsearch/src/components/InstantSearchSsr';
import Pagination from 'vue-instantsearch/src/components/Pagination';
import Panel from 'vue-instantsearch/src/components/Panel';
import SearchBox from 'vue-instantsearch/src/components/SearchBox';
import Stats from 'vue-instantsearch/src/components/Stats';

const algoliaAppId = 'C48JP0TE4V';
const algoliaSearchKey = 'ac656632a9cdaa15f7a02927bb881e33';
const productIndex = 'ryobitools_staging_search_products';

window.aa('init', {
  appId: algoliaAppId,
  apiKey: algoliaSearchKey,
});

export default {
  name: 'Search',
  components: {
    Configure,
    HierarchicalMenu,
    Hits,
    InstantSearch,
    Pagination,
    Panel,
    SearchBox,
    Stats,
  },
  provide() {
    return {
      // Provide the InstantSearch instance for SSR
      $_ais_ssrInstantSearchInstance: this.instantsearch,
    };
  },
  mounted() {
    window.aa('setUserToken', 'ryobitools_staging');
  },
  data() {
    const searchClient = algoliasearch(algoliaAppId, algoliaSearchKey);
    const mixin = createServerRootMixin({
      searchClient,
      indexName: productIndex,
    });

    return {
      productIndex,
      query: '',
      ...mixin.data(),
    };
  },
  methods: {
    triggerInsights(product) {
      console.log(product);
      const payload = {
        eventName: 'conversion_test',
        index: productIndex,
        queryID: product.__queryID,
        objectIDs: [product.objectID],
        positions: [product.__position],
      };
      console.log('sending insights:', payload);
      window.aa('convertedObjectIDsAfterSearch', payload);
    },
  },
};
</script>