import algoliasearch from 'algoliasearch';
import instantsearch from 'instantsearch.js';
import {
  searchBox,
  hits,
  configure,
  pagination,
} from 'instantsearch.js/es/widgets';
import {
  extractRankingAttributeName,
  nestedObjectGetUpdate,
  formatAttributeValue,
} from './helpers.js';
import {
  APP_ID,
  API_KEY,
  INDICES,
  CONFIG_INDEX_A,
  CONFIG_INDEX_B,
} from './config.js';

const algoliaClient = algoliasearch(APP_ID, API_KEY);

function getSearchClient() {
  return {
    ...algoliaClient,
    search(requests) {
      return algoliaClient.search(requests);
    },
  };
}

async function getConfigsAndInit(isLiveConfigChange) {
  if (
    !document.getElementById('index-a').value ||
    !document.getElementById('index-b').value
  ) {
    return;
  }
  if (isLiveConfigChange !== true) {
    document.getElementById('index-a').value = INDICES[0];
    document.getElementById('index-b').value = INDICES[1];
  }

  const indexA = document.getElementById('index-a').value;
  const indexB = document.getElementById('index-b').value;
  try {
    const settingsA = await algoliaClient.initIndex(indexA).getSettings();
    const customRankingsA = settingsA.customRanking.map((cr) =>
      extractRankingAttributeName(cr)
    );
    const settingsB = await algoliaClient.initIndex(indexB).getSettings();
    const customRankingsB = settingsB.customRanking.map((cr) =>
      extractRankingAttributeName(cr)
    );
    initIS(
      {
        indexName: indexA,
        reranking: document.getElementById('reranking-a').checked,
        customRankings: customRankingsA,
      },
      {
        indexName: indexB,
        reranking: document.getElementById('reranking-b').checked,
        customRankings: customRankingsB,
      }
    );
  } catch (error) {
    initIS(
      {
        indexName: indexA,
        reranking: document.getElementById('reranking-a').checked,
      },
      {
        indexName: indexB,
        reranking: document.getElementById('reranking-b').checked,
      }
    );
  }
}

document.getElementById('index-a').addEventListener('change', (event) => {
  document.getElementById('index-a').value = event.target.value;
  let listA = document.getElementById('listForA');

  [...new Set(INDICES)].forEach((item) => {
    var option = document.createElement('option');
    option.value = item;
    listA.appendChild(option);
  });
  getConfigsAndInit(true);
});

document.getElementById('index-b').addEventListener('change', (event) => {
  document.getElementById('index-b').value = event.target.value;
  let listB = document.getElementById('listForB');

  [...new Set(INDICES)].forEach((item) => {
    var option = document.createElement('option');
    option.value = item;
    listB.appendChild(option);
  });
  getConfigsAndInit(true);
});

document.getElementById('reranking-a').addEventListener('change', (event) => {
  getConfigsAndInit(true);
});

document.getElementById('reranking-b').addEventListener('change', (event) => {
  getConfigsAndInit(true);
});

function generateTemplate(item, fields) {
  let labels = fields.labels.map((label) => {
    let value = nestedObjectGetUpdate(item, label.attribute);
    if (label.color) {
      return `<div>${label.text}: <span class=${label.color}><b>${value}</b></span></div>`;
    }
    return `<div>${label.text}: <b>${value}</b></div>`;
  });
  let customRankingAttributes = [];
  if (fields.customRankings && fields.customRankings) {
    customRankingAttributes = fields.customRankings.map((cr) => {
      let value = formatAttributeValue(nestedObjectGetUpdate(item, cr));
      return `<p>🏆 ${cr}: <span class=${
        value === true ? `green` : value === false ? `red` : `blue`
      }><b>${value}</b></span></p>`;
    });
  }
  return `
  <img src="${fields.image}"></img>
  <div class="small-text">
    ${labels.join('')}
    </div>
    ${
      customRankingAttributes.length > 0
        ? `<div class="custom-rankings">
      ${customRankingAttributes.join('')}
      </div>`
        : ''
    }`;
}

function initIS(configA, configB) {
  const subIndex = instantsearch({
    indexName: configB.indexName,
    searchClient: getSearchClient(),
  });

  subIndex.addWidgets([
    configure({
      hitsPerPage: 40,
      analytics: false,
      enableABTest: false,
      enableReRanking: configB.reranking,
    }),
    pagination({
      container: '#pagination-b',
    }),
    hits({
      container: '#hits-instant-search-b',
      transformItems(items) {
        return items.map((item) => ({
          ...item,
          image: item.image_urls[0],
          stockColor: item.stock > 0 ? 'green' : 'red',
        }));
      },
      templates: {
        item: (item) =>
          generateTemplate(item, {
            image: item.image,
            labels: CONFIG_INDEX_B,
            customRankings: configB.customRankings,
          }),
      },
    }),
  ]);

  const mainIndex = instantsearch({
    indexName: configA.indexName,
    searchClient: getSearchClient(),
    searchFunction(helper) {
      subIndex.helper.setQuery(helper.state.query).search();
      helper.search();
    },
  });

  var myNode = document.getElementById('searchbox');
  while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);
  }
  mainIndex.addWidgets([
    searchBox({
      container: '#searchbox',
    }),
    configure({
      hitsPerPage: 40,
      analytics: false,
      enableABTest: false,
      enableReRanking: configA.reranking,
    }),
    pagination({
      container: '#pagination-a',
    }),
    hits({
      container: '#hits-instant-search-a',
      transformItems(items) {
        return items.map((item) => ({
          ...item,
          image: item.image_urls[0],
          stockColor: item.stock > 0 ? 'green' : 'red',
        }));
      },
      templates: {
        item: (item) =>
          generateTemplate(item, {
            image: item.image,
            labels: CONFIG_INDEX_A,
            customRankings: configA.customRankings,
          }),
      },
    }),
  ]);

  subIndex.start();
  mainIndex.start();
}

getConfigsAndInit();
