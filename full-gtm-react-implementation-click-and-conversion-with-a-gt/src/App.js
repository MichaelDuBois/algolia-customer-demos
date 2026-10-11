import algoliasearch from "algoliasearch/lite";
import React from "react";
import TagManager from "react-gtm-module";
import {
  InstantSearch,
  Hits,
  SearchBox,
  Highlight,
  Pagination,
  ClearRefinements,
  Configure,
  connectRefinementList
} from "react-instantsearch-dom";
import { Link } from "react-router-dom";
import "./App.css";

const tagManagerArgs = {
  gtmId: "GTM-W4K6HCD",
  dataLayer: {
    algoliaUserToken: "default_user"
  }
};

const indexName = "movies_instant";

TagManager.initialize(tagManagerArgs);

const searchClient = algoliasearch(
  "P4H4N903HM",
  "f45942de4172c8021a84222d0cabadc2"
);

const RefinementList = ({ items, refine, attribute }) => {
  return (
    <div className="ais-RefinementList">
      <ul className="ais-RefinementList-list">
        {items.map((item) => (
          <li className="ais-RefinementList-item" key={item.value}>
            <div>
              <label
                className="ais-RefinementList-label"
                data-insights-filter={`${attribute}:${item.value}`}
                onClick={(event) => {
                  event.preventDefault();
                  refine(item.value);
                }}
              >
                <span className="ais-RefinementList-labelText">
                  {item.label}
                </span>
                <span className="ais-RefinementList-count">{item.count}</span>
              </label>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const CustomRefinementList = connectRefinementList(RefinementList);

function App() {
  return (
    <div className="ais-InstantSearch">
      <InstantSearch searchClient={searchClient} indexName={indexName}>
        <Configure clickAnalytics={true} userToken={"default_user"} />
        <div className="left-panel" data-insights-index={indexName}>
          <ClearRefinements />
          <h2>Genre</h2>
          <CustomRefinementList attribute="genres" />
          <h2>Actors</h2>
          <CustomRefinementList attribute="actors" />
          <h2>Year</h2>
          <CustomRefinementList attribute="year" />
          <Configure hitsPerPage={8} />
        </div>
        <div className="right-panel" data-insights-index={indexName}>
          <SearchBox />
          <Hits hitComponent={Product} />
          <Pagination />
        </div>
        <div className="right-panel"></div>
      </InstantSearch>
    </div>
  );
}

const Product = ({ hit }) => {
  return (
    <div
      data-insights-object-id={hit.objectID}
      data-insights-position={hit.__position}
      data-insights-query-id={hit.__queryID}
    >
      <img src={hit.poster} align="left" height={200} alt={hit.poster} />
      <div className="hit-name">
        <Highlight attribute="title" hit={hit} />
      </div>
      <div className="hit-description">
        <Highlight attribute="overview" hit={hit} />
      </div>
      <div className="hit-price">${hit.price}</div>
      <Link
        to="/product"
        state={{
          title: hit.title,
          img: hit.poster,
          description: hit.overview,
          objectId: hit.objectID,
          queryId: hit.__queryID,
          index: indexName
        }}
      >
        View Details
      </Link>
    </div>
  );
};

export default App;
