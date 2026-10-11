import "./styles.css";

import algoliasearch from "algoliasearch";
import { CustomHit } from "./Components/Hits";
import type { HitProps } from "./Components/Hits";
import { Autocomplete } from "./Components/Autocomplete";

import {
  InstantSearch,
  RefinementList,
  Pagination
} from "react-instantsearch-hooks-web";

import "@algolia/autocomplete-theme-classic";
import { useState, useEffect } from "react";

const INSTANT_SEARCH_INDEX_NAME = "instant_search";
const SEARCH_API_KEY = "21d2cd80869e20eb0becf4065f058b95";
const SEARCH_APP_ID = "SRD7V01PUE";

export default function App() {
  const searchClient = algoliasearch(SEARCH_APP_ID, SEARCH_API_KEY);

  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    const data = window.localStorage.getItem("Hibbetts_recently_viewed_items");
    if (data) setRecentlyViewed(JSON.parse(data));
  }, []);

  const addItem = (hit) => {
    let currData = [];
    let localStorage = window.localStorage.getItem(
      "Hibbetts_recently_viewed_items"
    );
    if (localStorage) {
      currData = JSON.parse(localStorage);
    }
    if (currData) {
      currData = [...currData, hit];
      window.localStorage.setItem(
        "Hibbetts_recently_viewed_items",
        JSON.stringify(currData)
      );
    }
  };

  const removeItem = (item: HitProps["hit"]) => {
    let currData = [];
    let localStorage = window.localStorage.getItem(
      "Hibbetts_recently_viewed_items"
    );
    if (localStorage) {
      currData = JSON.parse(localStorage);
    }
    if (currData) {
      currData = currData.filter((recentItem: HitProps["hit"]) => {
        return recentItem.objectID !== item.objectID;
      });
    }
    window.localStorage.setItem(
      "Hibbetts_recently_viewed_items",
      JSON.stringify(currData)
    );
  };
  return (
    <div className="App">
      <InstantSearch
        searchClient={searchClient}
        indexName={INSTANT_SEARCH_INDEX_NAME}
        insights={true}
        routing={true}
      >
        <div className="header">
          <div className="header-title">
            <h1>Generic Title</h1>
          </div>
          <div className="header-wrapper wrapper">
            <Autocomplete
              detachedMediaQuery="none"
              openOnFocus
              placeholder="Search Products"
            />
          </div>
        </div>

        <div className="container">
          <div className="container-filters">
            <RefinementList
              attribute="categories"
              limit={5}
              sortBy={["count:desc"]}
            />
          </div>

          <div className="container-results">
            <div className="recentlyViewed">
              <h1>Caroussel</h1>
              <div className="carousel">
                {recentlyViewed.map((item: HitProps["hit"]) => {
                  return (
                    <div className="hit">
                      <div className="hit-image-container">
                        <img
                          className="hit-image"
                          src={item.image}
                          alt={item.name}
                        />
                      </div>

                      <div className="hit-info-container">
                        <h1 className="hit-title">{item.name}</h1>
                        <p>
                          {item.categories[0]} - {item.price}
                        </p>
                        <button onClick={() => removeItem(item)}>Remove</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <h1>Hits</h1>
            <CustomHit handleChange={addItem} />
            <Pagination />
          </div>
        </div>
      </InstantSearch>
    </div>
  );
}
