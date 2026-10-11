import React from 'react';
import {
  connectHits,
  connectStateResults,
  Highlight,
} from 'react-instantsearch-dom';
import '../App.css';
import SkeletonCardGrid from './SkeletonCardGrid';

const LoadingIndicatorState = ({ isSearchStalled, searchResults }) => {
  const hasResults = searchResults && searchResults.nbHits !== 0;
  console.log('isSearchStalled: ', isSearchStalled);

  if (isSearchStalled || hasResults == null) {
    return <SkeletonCardGrid />;
  } else {
    return null;
  }
};

const LoadingIndicator = connectStateResults(LoadingIndicatorState);

const Hits = ({ hits }) => (
  <>
    <div className="hits">
      <div className="ais-Hits">
        {hits.length > 0 ? (
          hits.map((hit) => (
            //   <li key={hit.objectID}>
            <div key={hit.objectID} className="ais-Hits-item">
              <img src={hit.image} align="left" alt={hit.name} />
              <div className="hit-name">
                <Highlight attribute="name" hit={hit} />
              </div>
              <div className="hit-description">
                <Highlight attribute="description" hit={hit} />
              </div>
              <div className="hit-price">${hit.price}</div>
            </div>
            //   </li>
          ))
        ) : (
          <>
            <LoadingIndicator />
          </>
        )}
      </div>
    </div>
  </>
);

const CustomHits = connectHits(Hits);

const Hit = ({ hit }) => {
  return (
    <div>
      <img src={hit.image} align="left" alt={hit.name} />
      <div className="hit-name">
        <Highlight attribute="name" hit={hit} />
      </div>
      <div className="hit-description">
        <Highlight attribute="description" hit={hit} />
      </div>
      <div className="hit-price">${hit.price}</div>
    </div>
  );
};

export default CustomHits;
