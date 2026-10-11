const { searchClient, aa } = window;
const recommend = window["@algolia/recommend"];
const { relatedProducts } = window["@algolia/recommend-js"];

/*const recommendClient = recommend(
  "3EA6KSSDGW",
  "23fef1254e41ec407b1fc80f852e4a40"
);*/

const loadProduct = async (objectID, queryID) => {
  const index = searchClient.initIndex("movies");
  const hit = await index.getObject(objectID);

  const html = `
    <h1>${hit.title}</h1>
    <div id="movie_details">
      <div id="poster">
        <img src="${hit.poster}" />
      </div>
      <div id="presentation">
        <p>${hit.overview}</p>
        <p>Director: <a href="/search?${encodeURIComponent(
          "refinementList[actors][0]"
        )}=${encodeURIComponent(hit.director)}
        ">${hit.director}</a></p>
        <p>Actors: ${hit.actors
          .slice(0, 10)
          .map((actor) => {
            return `<a href="/search?${encodeURIComponent(
              "refinementList[actors][0]"
            )}=${encodeURIComponent(actor)}
            ">${actor}</a>`;
          })
          .join(", ")}
        <p><button class="addToCard" data-objectid="${
          hit.objectID
        }" data-queryID="${queryID}">Add to card</button></p>
      </div>
    </div>
  `;

  document.getElementById("product").innerHTML = html;

  //Send Insight "hit Viewed"
  aa("viewedObjectIDs", {
    index: "movies",
    eventName: "movie page viewed",
    objectIDs: [hit.objectID],
  });

  //Load recommendations
  /* relatedProducts({
    container: "#relatedProducts",
    recommendClient,
    objectIDs: [hit.objectID],
    indexName: "movies",
    maxRecommendations: 8,
    itemComponent({ item, html }) {
      return html`
        <a href="/product/${item.objectID}">
          <img src="${item.poster}" width="100" />
        </a>
      `;
    },
    headerComponent({ html }) {
      return html`<h2>You may also like</h2>`;
    }
  });*/
};

export function render(objectID, queryID) {
  loadProduct(objectID, queryID);
}

if (module.hot) {
  module.hot.accept(function () {
    window.location.reload();
  });
}
