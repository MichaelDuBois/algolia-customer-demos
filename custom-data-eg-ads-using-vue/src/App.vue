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
      <ais-instant-search :search-client="searchClient"
       index-name="cheese"
      :routing="routing" ruleContexts="ruleContexts">
        <div class="search-panel">
            
          <div class="search-panel__filte-brand" style="display:block;">
            <h3>condition</h3>
            <ais-refinement-list attribute="condition" />
          </div>
          
              
          <div class="search-panel__filters-colour">
            <h3>Name</h3>
            <ais-refinement-list attribute="name" />
          </div>
          <div class="search-panel__filters-stats">
              <ais-stats/>
          </div>
          <div class="search-panel__results">
            <div class="searchbox">
              <ais-search-box placeholder="type cheese to see custom data" />
            </div>
              <ais-query-rule-custom-data :transform-items="transformItemsAdvert" />
              <ais-hits :transform-items="transformItems">
                 <template v-slot:item="{ item }">
                  <h2>{{ item.name }}</h2>
                  <a :href="item.url">
                    <img
                      :src="item.image"
                      :alt="item.name"
                      width="100%"
                      height="70%"
                    />
                  </a>
                   </template>
              </ais-hits>  
              <div class="pagination">
                <ais-pagination />
              </div>
          
        
            </div>
          </div>
      </ais-instant-search>
    </div>
  </div>
</template>

<script>
import algoliasearch from 'algoliasearch/lite';
import { history } from 'instantsearch.js/es/lib/routers';
// import { useRoute } from 'vue-router';
import { singleIndex as singleIndexMapping } from 'instantsearch.js/es/lib/stateMappings';

let advert = {}
const isAdvert = (obj, items) => {
  advert = {}
  if(obj[0]?.position) {
   return advert = obj[0]
  }
}
const addAdvert = (arr, obj) => {
  if(obj?.url){
    return arr.splice(obj.position - 1, 0, obj);
  }
}
export default {
  setup(props) {
    // const { campaign: context } = history.query
    const contextRules = "rings" !== undefined ? ["rings"] : []
    console.log('contextRules'.contextRules)
    return {
      contextRules,
    }
  },
  // computed: {
  //   ruleContexts(context) {
  //     console.log('context', context)
  //     return ['rings']
  //   }
  // },
  data() {
    //console.log('rules', this.searchStore.queryParameters.ruleContexts)
    return {
      searchClient: algoliasearch('QW4A69MIUY', 'd78e9402a41a57ff70c388a6bffcebe1'),
      routing: {
        router: history(),
        stateMapping: singleIndexMapping('cheese'),
      },
      transformItemsAdvert(el) {
        isAdvert(el)
      },
      transformItems(items) {
        if(advert?.url) {
         addAdvert(items, advert)
        }
        return items.map(item => ({
          ...item,
        }));
      },
      ruleContexts() {
        return ['rings']
      }
    };
  },
  // computed: {
  //   ruleContexts(context) {
  //       console.log('context', context)
  //       return context
  //     }
  //   }
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
  position: relative;
}
.search-panel__container > div {
   display: flex;
}

.search-panel__filte-brand {
  width: 20vw;
  margin-top: 20px;
}

.search-panel__filters-colour {
  width: 20vw
}
.search-panel__filters-stats {
  position: absolute;
  top: -11%;
  left: 0;
}
.search-panel__results {
  width:70vw;
  position: absolute;
  top: -11%;
  left: 20vw;
}

.searchbox {
  margin-bottom: 2rem;
}

.pagination {
  margin: 2rem auto;
  text-align: center;
}
</style>
