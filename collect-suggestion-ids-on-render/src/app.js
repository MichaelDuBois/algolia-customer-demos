import algoliasearch from 'algoliasearch';
import autocomplete from 'autocomplete.js';

const client = algoliasearch('latency', '6be0576ff61c053d5f9a3225e2a90f76');
const index = client.initIndex('instant_search');

autocomplete('#searchBox input[type=search]', { hint: false }, [
  {
    source: autocomplete.sources.hits(index, { hitsPerPage: 5 }),
    displayKey: 'name',
    templates: {
      suggestion(suggestion) {
        // 1. create an attribute which includes
        // some identifying data from the indexed Algolia record
        // that can be used to match with Salesforce
        return `<div class='aa-record' data-object-id=${suggestion.objectID}>${suggestion._highlightResult.name.value}</div>`;
      },
    },
  },
]).on('autocomplete:updated', (event, suggestion, dataset) => {
  // 2. on render of the suggestions
  // collect the identifiers
  let objectIDs = [];
  let suggestionNodes = document.getElementsByClassName('aa-record');
  let suggestionArray = Array.from(suggestionNodes);
  suggestionArray.forEach((suggestion) => {
    let objectID = suggestion.getAttribute('data-object-id');
    objectIDs.push(objectID);
  });
  // 3. do something with the identifiers
  console.log(objectIDs);
});
