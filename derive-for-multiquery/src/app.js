import algoliasearch from 'algoliasearch';
import algoliasearchHelper from 'algoliasearch-helper';

const client = algoliasearch('SYZEVV63H0', 'ff50200b10c65dd7a6c787abab234423');
const helper = algoliasearchHelper(client, 'example_product_test', {
  disjunctiveFacets: ['subject', 'partner'],
  facets: ['product'],
});

const $searchBox = document.querySelector('#searchBox input[type=search]');
const $hits = document.querySelector('#hits');

const $addButton = document.querySelector('#add');
const $removeButton = document.querySelector('#remove');

$searchBox.addEventListener('input', (event) => {
  const query = event.target.value;
  console.log(helper);

  helper.setQuery(query).search();
});

$addButton.addEventListener('click', () => {
  // Add 1 derived helper for a multiQuery on facet 'product', value 'Course'
  helper.derive(function (state) {
    return state.addFacetRefinement('product', 'Course');
  });
  // Add 1 derived helper for a multiQuery on facet 'product', value 'Program'
  helper.derive(function (state) {
    return state.addFacetRefinement('product', 'Program');
  });
});

$removeButton.addEventListener('click', () => {
  while (helper.derivedHelpers && helper.derivedHelpers.length) {
    const helperInstances = helper.derivedHelpers;
    helperInstances.forEach((instance) => {
      instance.detach();
      console.log('Detached');
      console.log(helper);
    });
  }
});

helper.on('result', (result) => {
  // Please sanitize user-provided data when using `innerHTML` to avoid XSS

  // Inspect helper to see derivedHelpers present
  // Also visible in response of network request
  console.log(
    `There are: ${
      helper.derivedHelpers ? helper.derivedHelpers.length : '0'
    } derivedHelpers`
  );
  if (helper.derivedHelpers && helper.derivedHelpers.length) {
    helper.derivedHelpers.forEach((derivedHelper) => {
      console.log(derivedHelper.main);
    });
  }

  $hits.innerHTML = `
    <ol class="ais-hits">
      ${result.hits
        .map(
          (hit) =>
            `<li class="ais-hits--item">
              <article>
                <h1>${hit.title}</h1>
                <p>${hit.primary_description}</p>
              </article>
            </li>`
        )
        .join('')}
    </ol>`;
});

helper.search();
