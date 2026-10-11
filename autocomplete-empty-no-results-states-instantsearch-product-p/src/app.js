//Init Search Client
const { algoliasearch, instantsearch } = window;

window.searchClient = algoliasearch(
  "3EA6KSSDGW",
  "23fef1254e41ec407b1fc80f852e4a40"
);

//Init Insights
window.aa("init", {
  appId: "3EA6KSSDGW",
  apiKey: "23fef1254e41ec407b1fc80f852e4a40",
  useCookie: true
});

//Listener for all addToCart clicks
document.addEventListener("click", (event) => {
  if (
    event.srcElement &&
    event.srcElement.className === "addToCard" &&
    event.srcElement.dataset.objectid
  ) {
    if (
      event.srcElement.dataset.queryid &&
      event.srcElement.dataset.queryid !== ""
    ) {
      //Send Insight "hit Viewed"
      window.aa("convertedObjectIDsAfterSearch", {
        index: "movies",
        eventName: "added to card",
        objectIDs: [event.srcElement.dataset.objectid],
        queryID: event.srcElement.dataset.queryid
      });
    } else {
      window.aa("convertedObjectIDs", {
        index: "movies",
        eventName: "added to card",
        objectIDs: [event.srcElement.dataset.objectid]
      });
    }
  }
});

//If user is logged in, make sure to pass a unique User Token derivated from user Account
//window.aa('setUserToken', 'USER_ID');

//Routing
async function load() {
  const searchAndCategoryPage = await import("./search");
  const productPage = await import("./product");

  // Sur la page recherche
  const parsedUrl = new URL(window.location.href);

  const pathElements = parsedUrl.pathname.split("/");
  const page = pathElements[1] || "";
  const param = pathElements[2] || "";

  switch (page) {
    case "search":
      searchAndCategoryPage.renderSearchPage(param);
      break;
    case "category":
      searchAndCategoryPage.renderCategoryPage(param);
      break;
    case "product":
      const queryID = parsedUrl.searchParams.get("queryID") || false;
      productPage.render(param, queryID);
      break;
    default:
    //nothing more to display
  }
}

load();

if (module.hot) {
  module.hot.accept(function () {
    window.location.reload();
  });
}
