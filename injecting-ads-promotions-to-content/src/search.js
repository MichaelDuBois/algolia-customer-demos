function render(hits) {
  const html = hits
    .map((hit) => {
      return `<li style="background-image: url('${
        hit.image ? hit.image : hit.picture
      }')">
        ${hit.isInjectedContent ? "<div class='sponsored'>sponsored</div>" : ""}
      </li>`;
    })
    .join("");
  document.getElementById("results").innerHTML = html;
}

function mergeHits(normalResults, adResults, mergePositions) {
  // When merging consider removing you've already seen
  // For now this does not do this
  const hits = mergePositions.reduce((acc, curr, index) => {
    if (adResults[index]) {
      acc.splice(curr, 0, {
        ...adResults[index],
        isInjectedContent: "true"
      });
    }

    return acc;
  }, normalResults.slice());

  render(hits);
}

function search(query, filterForAds, adPositions, client, indexName) {
  // Use multiple queries vs single query
  // https://www.algolia.com/doc/api-reference/api-methods/multiple-queries/?client=scala
  client
    .multipleQueries([
      {
        indexName,
        query,
        params: {
          hitsPerPage: 24
        },
        analyticsTags: ["{region}"]
      },
      {
        indexName,
        query,
        params: {
          hitsPerPage: adPositions.length,
          // filter the index to just include ad's
          filters: filterForAds,
          // discount this from analytics
          analytics: false,
          // make it easier to identify in logs
          analyticsTags: ["ads"]
        }
      }
    ])
    .then(({ results }) => {
      const normalResults = results[0].hits;
      const adResults = results[1].hits;

      // Once returned merge results
      mergeHits(normalResults, adResults, adPositions);
    })
    .catch((err) => console.error(err));
}

export default search;
