import algoliasearch from 'algoliasearch';

const client = algoliasearch('SYZEVV63H0', '05b261aae86763f98dd15384d94440eb');
const index = client.initIndex('product_test_05172021');

const $searchBox = document.querySelector('#searchBox input[type=search]');
const $hits = document.querySelector('#hits');

function renderHits(query) {
  index.search(query).then((result) => {
    // Please sanitize user-provided data when using `innerHTML` to avoid XSS
    $hits.innerHTML = `
      <ol class="ais-hits">
        ${result.hits
          .map(
            (hit) =>
              `<li class="ais-hits--item">
                <article>
                  <h1>${hit.title}</h1>
                </article>
              </li>`
          )
          .join('')}
      </ol>`;
  });
}

function sendMultipleQueries(query) {
  const queries = [
    {
      indexName: 'product_test_05172021',
      query,
      params: {
        hitsPerPage: 3,
        facetFilters: 'product:Program',
        attributesToRetrieve: ['title', 'owners', 'marketing_url'],
        clickAnalytics: true,
      },
    },
    {
      indexName: 'product_test_05172021',
      query,
      params: {
        hitsPerPage: 3,
        facetFilters: 'product:Course',
        attributesToRetrieve: ['title', 'owners', 'marketing_url'],
        clickAnalytics: true,
      },
    },
  ];

  client.multipleQueries(queries).then(({ results }) => {
    // Iterate through each result array
    const newResults = results.map((result) => {
      return {
        ...result,
        // Calculate hit position
        hitsWithPosition: result.hits.map((hit) => {
          // relative hit position = (page * hitsPerPage) + index + 1
          let offset = result.hitsPerPage * result.page;
          let hitPosition = offset + result.hits.indexOf(hit) + 1;
          // return updated hit with hitPosition
          return { ...hit, hitPosition };
        }),
      };
    });
    // Inspect result.hitsWithPosition in console
    console.log(newResults);
  });
}

$searchBox.addEventListener('input', (event) => {
  const query = event.target.value;
  sendMultipleQueries(query);
  renderHits(query);
});

renderHits('');
