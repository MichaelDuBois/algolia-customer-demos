import type { Hit as AlgoliaHit } from "instantsearch.js/es/types";
import React, { useState, useEffect } from "react";

import { useHits, UseHitsProps } from "react-instantsearch-hooks-web";

type HitProps = {
  hit: AlgoliaHit<{
    name: string;
    image: string;
    categories: string[];
    price: number;
  }>;
  sendEvent: Function;
};

type PropType = {
  props: UseHitsProps;
  handleChange: Function;
};

export function CustomHit({ props, handleChange }: PropType) {
  const [hitVal, setHit] = useState({});

  const change = (hit: HitProps["hit"]) => {
    setHit(hit);
    handleChange(hit);
  };

  const { hits, sendEvent } = useHits(props);
  return (
    <li className="hitsList">
      {hits.map((hit: HitProps["hit"]) => {
        return (
          <div className="hit">
            <div className="hit-image-container">
              <img className="hit-image" src={hit.image} alt={hit.name} />
            </div>

            <div className="hit-info-container">
              <h1 className="hit-title">{hit.name}</h1>
              <p>
                {hit.categories[0]} - {hit.price}
              </p>
              <button onClick={() => change(hit)}>
                Add to recently viewed
              </button>
            </div>
          </div>
        );
      })}
      ;
    </li>
  );
}

export type { HitProps };
